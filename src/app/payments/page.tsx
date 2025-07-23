'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentList from '@/components/payments/PaymentList';
import { workers as initialWorkers } from '@/lib/data';
import type { Worker, Attendance, Payment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddPaymentDialog from '@/components/payments/AddPaymentDialog';
import { useToast } from '@/hooks/use-toast';
import { attendances as initialAttendances, payments as initialPayments } from '@/lib/data';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    const savedWorkers = localStorage.getItem('workers');
    setWorkers(savedWorkers ? JSON.parse(savedWorkers) : initialWorkers);

    const savedAttendances = localStorage.getItem('allAttendance');
    const allAttendances: Record<string, Record<string, any>> = savedAttendances ? JSON.parse(savedAttendances) : {};
    
    const combinedAttendances: Attendance[] = [...initialAttendances];
    const newAttendances: Attendance[] = [];
    Object.entries(allAttendances).forEach(([date, dateRecords]) => {
      Object.entries(dateRecords).forEach(([workerId, record]) => {
        newAttendances.push({
          id: `att-${date}-${workerId}`,
          workerId,
          date,
          status: record.status,
          checkIn: record.checkIn ? new Date(record.checkIn) : undefined,
          checkOut: record.checkOut ? new Date(record.checkOut) : undefined,
        });
      });
    });

    const uniqueAttendances = new Map<string, Attendance>();
    initialAttendances.forEach(att => uniqueAttendances.set(`${att.date}-${att.workerId}`, att));
    newAttendances.forEach(att => uniqueAttendances.set(`${att.date}-${att.workerId}`, att));

    setAttendances(Array.from(uniqueAttendances.values()));


    const savedPayments = localStorage.getItem('payments');
    setPayments(savedPayments ? JSON.parse(savedPayments) : initialPayments);

  }, []);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  const handleAddPayment = (paymentData: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `p${Date.now()}`,
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
