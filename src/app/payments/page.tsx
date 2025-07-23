
'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentHistoryTable from '@/components/payments/PaymentHistoryTable';
import type { Worker, Payment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddPaymentDialog from '@/components/payments/AddPaymentDialog';
import { useToast } from '@/hooks/use-toast';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedWorkers = localStorage.getItem('workers');
      if (savedWorkers) {
        setWorkers(JSON.parse(savedWorkers));
      }
      
      const savedPayments = localStorage.getItem('payments');
      if (savedPayments) {
        setPayments(JSON.parse(savedPayments));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem('payments', JSON.stringify(payments));
    } catch (error) {
      console.error("Failed to save payments to localStorage", error);
    }
  }, [payments]);

  const handleAddPayment = (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `p${Date.now()}`,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setPayments(prev => [newPayment, ...prev]);
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
        <Button onClick={() => setIsPaymentDialogOpen(true)} className="bg-accent hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('payments.record.payment')}
        </Button>
      </div>
      <PaymentHistoryTable workers={workers} payments={payments} />
      <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onSavePayment={handleAddPayment}
        workers={workers}
      />
    </div>
  );
}
