
'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentList from '@/components/payments/PaymentList';
import { workers, attendances, payments } from '@/lib/data';

export default function PaymentsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('payments.title')}</h1>
      </div>
      <PaymentList workers={workers} attendances={attendances} payments={payments} />
    </div>
  );
}
