import { Suspense } from 'react';
import PaymentVerifyClient from './PaymentVerifyClient';

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--brand-sand)] px-6 pt-20">
          <div className="bg-white border border-black/10 rounded-2xl shadow-lg p-10 max-w-xl text-center">
            <div className="w-12 h-12 rounded-full border-4 border-black/10 border-t-[var(--brand-ink)] animate-spin mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[var(--brand-ink)] mb-3">Payment Verification</h1>
            <p className="text-slate-700 mb-6">Loading payment details...</p>
          </div>
        </div>
      }
    >
      <PaymentVerifyClient />
    </Suspense>
  );
}
