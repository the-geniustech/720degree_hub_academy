'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type VerificationState = 'idle' | 'loading' | 'success' | 'error';

export default function PaymentVerifyClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [state, setState] = useState<VerificationState>('idle');
  const [message, setMessage] = useState<string>('Verifying your payment...');

  useEffect(() => {
    if (!reference) {
      setState('error');
      setMessage('Missing payment reference. Please contact admissions.');
      return;
    }

    const verifyPayment = async () => {
      setState('loading');
      try {
        const response = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.error || 'Verification failed');
        }
        setState('success');
        setMessage('Payment verified. Your receipt and welcome details are on the way.');
      } catch (error) {
        console.error(error);
        setState('error');
        setMessage('We could not verify your payment yet. If you were charged, please contact admissions.');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-sand)] px-6 pt-20">
      <div className="bg-white border border-black/10 rounded-2xl shadow-lg p-10 max-w-xl text-center">
        {state === 'loading' && <Loader2 className="w-12 h-12 text-[var(--brand-ink)] animate-spin mx-auto mb-4" />}
        {state === 'success' && <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />}
        {state === 'error' && <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />}

        <h1 className="text-3xl font-bold text-[var(--brand-ink)] mb-3">
          {state === 'success' ? 'Payment Successful' : 'Payment Verification'}
        </h1>
        <p className="text-slate-700 mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admissions"
            className="px-6 py-3 rounded-lg bg-[var(--brand-ink)] text-white font-semibold hover:bg-black transition"
          >
            Admissions Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border border-black/10 text-[var(--brand-ink)] font-semibold hover:bg-black/5 transition"
          >
            Contact Admissions
          </Link>
        </div>
      </div>
    </div>
  );
}
