import { PrismaClient } from '@prisma/client';

type PrismaGlobal = typeof globalThis & {
  prisma?: PrismaClient;
  prismaMongoUri?: string;
};

function normalizeMongoUri(
  rawUri: string | undefined,
  configuredDatabaseName: string | undefined
) {
  if (!rawUri) {
    return {
      normalizedUri: rawUri,
      currentDatabaseName: undefined,
      targetDatabaseName: configuredDatabaseName,
    };
  }

  try {
    const url = new URL(rawUri);
    const currentDatabaseName = decodeURIComponent(url.pathname.replace(/^\/+/, '')) || undefined;
    const targetDatabaseName = configuredDatabaseName?.trim() || currentDatabaseName;

    if (targetDatabaseName && currentDatabaseName !== targetDatabaseName) {
      url.pathname = `/${encodeURIComponent(targetDatabaseName)}`;
    }

    return {
      normalizedUri: url.toString(),
      currentDatabaseName,
      targetDatabaseName,
    };
  } catch {
    return {
      normalizedUri: rawUri,
      currentDatabaseName: undefined,
      targetDatabaseName: configuredDatabaseName,
    };
  }
}

const { normalizedUri, currentDatabaseName, targetDatabaseName } = normalizeMongoUri(
  process.env.MONGODB_URI,
  process.env.MONGODB_DB
);

if (normalizedUri) {
  process.env.MONGODB_URI = normalizedUri;
}

if (
  process.env.NODE_ENV !== 'production' &&
  currentDatabaseName &&
  targetDatabaseName &&
  currentDatabaseName !== targetDatabaseName
) {
  console.warn(
    `[prisma] MONGODB_URI pointed to "${currentDatabaseName}" but MONGODB_DB is "${targetDatabaseName}". Using "${targetDatabaseName}".`
  );
}

const globalForPrisma = globalThis as PrismaGlobal;

if (globalForPrisma.prisma && globalForPrisma.prismaMongoUri !== normalizedUri) {
  void globalForPrisma.prisma.$disconnect().catch(() => undefined);
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaMongoUri = normalizedUri;
}
