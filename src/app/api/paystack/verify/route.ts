import { handleSuccessfulPayment } from '../../../lib/student-onboarding';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return Response.json({ ok: false, error: 'Missing reference' }, { status: 400 });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return Response.json({ ok: false, error: 'Paystack not configured' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      return Response.json({ ok: false, error: data.message || 'Verification failed' }, { status: 400 });
    }

    if (data.data?.status === 'success') {
      const amount = data.data.amount ? data.data.amount / 100 : 0;
      const paidAt = data.data.paid_at ? new Date(data.data.paid_at) : new Date();
      const origin = request.headers.get('origin');
      const result = await handleSuccessfulPayment({
        reference: data.data.reference || reference,
        amount,
        paidAt,
        paystackEvent: data,
        origin,
      });
      if (!result.ok) {
        console.warn('Payment processed but application not found for reference:', reference);
      }
    }

    return Response.json({ ok: true, data: data.data });
  } catch (error) {
    console.error('Paystack verification error:', error);
    return Response.json({ ok: false, error: 'Verification failed' }, { status: 500 });
  }
}
