type PaystackMode = "live" | "test";

type PaystackConfigSuccess = {
  ok: true;
  secretKey: string;
  mode: PaystackMode;
};

type PaystackConfigFailure = {
  ok: false;
  message: string;
  publicMessage: string;
};

type PaystackConfigResult = PaystackConfigSuccess | PaystackConfigFailure;

type PaystackInitPayload = {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
  requestOrigin?: string | null;
  callbackPath?: string;
  config?: PaystackConfigSuccess;
};

type PaystackInitSuccess = {
  ok: true;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  warnings: string[];
  callbackUrl?: string;
};

type PaystackInitFailure = {
  ok: false;
  status: number;
  message: string;
  publicMessage: string;
  warnings: string[];
  configError: boolean;
  retryable: boolean;
};

export type PaystackInitResult = PaystackInitSuccess | PaystackInitFailure;

function getEnvValue(name: string) {
  return process.env[name]?.trim();
}

function getPaystackMode(secretKey: string): PaystackMode | null {
  if (secretKey.startsWith("sk_live")) return "live";
  if (secretKey.startsWith("sk_test")) return "test";
  return null;
}

function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname.endsWith(".local")
  );
}

function toAbsoluteUrl(value: string) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function toCallbackUrl(baseUrl: string, callbackPath: string) {
  const url = toAbsoluteUrl(baseUrl);
  if (!url) {
    return null;
  }

  url.pathname = callbackPath.startsWith("/") ? callbackPath : `/${callbackPath}`;
  url.search = "";
  url.hash = "";
  return url;
}

function resolveCallbackUrl(options: {
  mode: PaystackMode;
  requestOrigin?: string | null;
  callbackPath?: string;
}) {
  const { mode, requestOrigin, callbackPath = "/payment/verify" } = options;
  const warnings: string[] = [];

  const configuredCallback = getEnvValue("PAYSTACK_CALLBACK_URL");
  if (configuredCallback) {
    const url = toAbsoluteUrl(configuredCallback);
    if (!url) {
      warnings.push("Ignoring PAYSTACK_CALLBACK_URL because it is not a valid absolute URL.");
    } else if (
      mode === "live" &&
      (url.protocol !== "https:" || isLocalHostname(url.hostname))
    ) {
      warnings.push(
        "Ignoring PAYSTACK_CALLBACK_URL because live payments require a public HTTPS callback URL.",
      );
    } else {
      return { callbackUrl: url.toString(), warnings };
    }
  }

  const appBaseUrl = getEnvValue("APP_BASE_URL");
  if (appBaseUrl) {
    const url = toCallbackUrl(appBaseUrl, callbackPath);
    if (!url) {
      warnings.push("Ignoring APP_BASE_URL because it is not a valid absolute URL.");
    } else if (
      mode === "live" &&
      (url.protocol !== "https:" || isLocalHostname(url.hostname))
    ) {
      warnings.push(
        "Ignoring APP_BASE_URL callback because live payments require a public HTTPS callback URL.",
      );
    } else {
      return { callbackUrl: url.toString(), warnings };
    }
  }

  if (requestOrigin) {
    const url = toCallbackUrl(requestOrigin, callbackPath);
    if (url) {
      if (
        mode === "live" &&
        (url.protocol !== "https:" || isLocalHostname(url.hostname))
      ) {
        warnings.push(
          "Ignoring the request origin as callback because live payments cannot redirect to localhost or non-HTTPS URLs.",
        );
      } else {
        return { callbackUrl: url.toString(), warnings };
      }
    }
  }

  return { warnings };
}

function parseResponseBody(rawBody: string) {
  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as Record<string, any>;
  } catch {
    return rawBody;
  }
}

export function getPaystackServerConfig(): PaystackConfigResult {
  const secretKey = getEnvValue("PAYSTACK_SECRET_KEY");
  if (!secretKey) {
    return {
      ok: false,
      message: "PAYSTACK_SECRET_KEY is not set.",
      publicMessage: "Payment service is not configured. Please contact admissions.",
    };
  }

  if (secretKey.startsWith("pk_")) {
    return {
      ok: false,
      message:
        "PAYSTACK_SECRET_KEY is using a public key prefix (`pk_`). Use the server secret key (`sk_live_...` or `sk_test_...`).",
      publicMessage:
        "Payment service is misconfigured. Please contact admissions to complete payment.",
    };
  }

  const mode = getPaystackMode(secretKey);
  if (!mode) {
    return {
      ok: false,
      message: "PAYSTACK_SECRET_KEY must start with `sk_test_` or `sk_live_`.",
      publicMessage:
        "Payment service is misconfigured. Please contact admissions to complete payment.",
    };
  }

  return { ok: true, secretKey, mode };
}

export async function initializePaystackTransaction(
  payload: PaystackInitPayload,
): Promise<PaystackInitResult> {
  const config = payload.config ?? getPaystackServerConfig();
  if (!config.ok) {
    return {
      ok: false,
      status: 500,
      message: config.message,
      publicMessage: config.publicMessage,
      warnings: [],
      configError: true,
      retryable: false,
    };
  }

  const { callbackUrl, warnings } = resolveCallbackUrl({
    mode: config.mode,
    requestOrigin: payload.requestOrigin,
    callbackPath: payload.callbackPath,
  });

  const body: Record<string, unknown> = {
    email: payload.email,
    amount: payload.amount,
    reference: payload.reference,
  };

  if (payload.metadata) {
    body.metadata = payload.metadata;
  }

  if (callbackUrl) {
    body.callback_url = callbackUrl;
  }

  let response: Response;

  try {
    response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach Paystack";
    console.error("Paystack initialization request failed:", {
      mode: config.mode,
      reference: payload.reference,
      callbackUrl: callbackUrl ?? null,
      warnings,
      error: message,
    });

    return {
      ok: false,
      status: 502,
      message,
      publicMessage: "Unable to initialise payment at this time.",
      warnings,
      configError: false,
      retryable: true,
    };
  }

  const rawBody = await response.text();
  const parsedBody = parseResponseBody(rawBody);
  const bodyAsRecord =
    parsedBody && typeof parsedBody === "object" && !Array.isArray(parsedBody)
      ? (parsedBody as Record<string, any>)
      : null;

  if (!response.ok || !bodyAsRecord?.status) {
    const detail =
      bodyAsRecord?.message ||
      (typeof parsedBody === "string" && parsedBody.trim()) ||
      `HTTP ${response.status}`;

    console.error("Paystack initialization failed:", {
      status: response.status,
      mode: config.mode,
      reference: payload.reference,
      callbackUrl: callbackUrl ?? null,
      warnings,
      responseBody: parsedBody ?? "<empty>",
    });

    return {
      ok: false,
      status: response.status || 502,
      message: detail,
      publicMessage:
        response.status === 401 || response.status === 403
          ? "Payment service rejected the configured Paystack credentials."
          : "Unable to initialise payment at this time.",
      warnings,
      configError: response.status === 401 || response.status === 403,
      retryable: response.status >= 500 || response.status === 429,
    };
  }

  const authorizationUrl = bodyAsRecord.data?.authorization_url;
  const accessCode = bodyAsRecord.data?.access_code;
  const reference = bodyAsRecord.data?.reference;

  if (!authorizationUrl || !accessCode || !reference) {
    console.error("Paystack initialization returned an incomplete payload:", {
      mode: config.mode,
      callbackUrl: callbackUrl ?? null,
      warnings,
      responseBody: bodyAsRecord,
    });

    return {
      ok: false,
      status: 502,
      message: "Paystack returned an incomplete initialization payload.",
      publicMessage: "Unable to initialise payment at this time.",
      warnings,
      configError: false,
      retryable: true,
    };
  }

  return {
    ok: true,
    data: {
      authorization_url: authorizationUrl,
      access_code: accessCode,
      reference,
    },
    warnings,
    callbackUrl,
  };
}
