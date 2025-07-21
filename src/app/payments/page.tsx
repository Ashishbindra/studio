
'use client';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentList from '@/components/payments/PaymentList';
import { workers as initialWorkers } from '@/lib/data';
import type { Worker, Attendance, Payment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddPaymentDialog from '@/components/payments/AddPaymentDialog';
import { useToast } from '@/hooks/use-toast';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [workers] = useState<Worker[]>(initialWorkers);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleAddPayment = (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `p${payments.length + 1}`,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setPayments(prev => [...prev, newPayment]);
    const worker = workers.find(w => w.id === newPayment.workerId);
    toast({
        title: t('toast.payment.recorded.title'),
        description: t('toast.payment.recorded.description').replace('{amount}', newPayment.amount.toString()).replace('{workerName}', worker?.name || 'worker'),
    });
    setIsPaymentDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('payments.title')}</h1>
        <Button onClick={() => setIsPaymentDialogOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('payments.record.payment')}
        </Button>
      </div>
      <PaymentList workers={workers} attendances={attendances} payments={payments} />
      <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onSavePayment={handleAddPayment}
        workers={workers}
      />
    </div>
  );
}
