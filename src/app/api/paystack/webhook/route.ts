import crypto from 'crypto';
import { handleSuccessfulPayment } from '../../../lib/student-onboarding';
import { getPaystackServerConfig } from '../../../lib/paystack';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const paystackConfig = getPaystackServerConfig();
  if (!paystackConfig.ok) {
    console.error('Paystack webhook configuration error:', paystackConfig.message);
    return new Response('Paystack not configured', { status: 400 });
  }

  const signature = request.headers.get('x-paystack-signature') || '';
  const body = await request.text();
  const hash = crypto.createHmac('sha512', paystackConfig.secretKey).update(body).digest('hex');

  if (hash !== signature) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    const amount = event.data.amount ? event.data.amount / 100 : 0;
    const paidAt = event.data.paid_at ? new Date(event.data.paid_at) : new Date();

    const result = await handleSuccessfulPayment({
      reference,
      amount,
      paidAt,
      paystackEvent: event,
    });
    if (!result.ok) {
      console.warn('Webhook payment received but application not found:', reference);
    }
  }

  return Response.json({ received: true });
}
