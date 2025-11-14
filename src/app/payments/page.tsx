
'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentHistoryTable from '@/components/payments/PaymentHistoryTable';
import type { Worker, Payment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddPaymentDialog from '@/components/payments/AddPaymentDialog';
import { useToast } from '@/hooks/use-toast';
import DeletePaymentDialog from '@/components/payments/DeletePaymentDialog';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const isInitialMount = useRef(true);
  
  // Load data from localStorage on initial mount
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

  // Save payments to localStorage whenever the payments state changes
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

  const handleAddOrEditPayment = (paymentData: Omit<Payment, 'id' | 'date'> & {date?: string}) => {
    const worker = workers.find(w => w.id === paymentData.workerId);
    if (!worker) return;
    
    if (paymentToEdit) {
      setPayments(prevPayments => 
        prevPayments.map(p =>
          p.id === paymentToEdit.id ? { ...paymentToEdit, ...paymentData, date: paymentData.date || paymentToEdit.date } : p
        )
      );
      toast({
        title: t('toast.payment.updated.title'),
        description: t('toast.payment.updated.description').replace('{amount}', paymentData.amount.toString()).replace('{workerName}', worker.name),
      });
    } else {
      const newPayment: Payment = {
        ...paymentData,
        id: `p${Date.now()}`,
        date: paymentData.date || new Date().toISOString().split('T')[0], // YYYY-MM-DD
      };
      setPayments(prev => [newPayment, ...prev]);
      toast({
          title: t('toast.payment.recorded.title'),
          description: t('toast.payment.recorded.description').replace('{amount}', newPayment.amount.toString()).replace('{workerName}', worker.name),
      });
    }
    setPaymentToEdit(null);
    setIsPaymentDialogOpen(false);
  };
  
  const handleOpenAddDialog = () => {
    setPaymentToEdit(null);
    setIsPaymentDialogOpen(true);
  };

  const handleOpenEditDialog = (payment: Payment) => {
    setPaymentToEdit(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleDeleteRequest = (payment: Payment) => {
    setPaymentToDelete(payment);
  };

  const handleDeleteConfirm = () => {
    if (paymentToDelete) {
      setPayments(prev => prev.filter(p => p.id !== paymentToDelete.id));
      const worker = workers.find(w => w.id === paymentToDelete.workerId);
      toast({
        title: t('toast.payment.deleted.title'),
        description: t('toast.payment.deleted.description').replace('{amount}', paymentToDelete.amount.toString()).replace('{workerName}', worker?.name || 'worker'),
        variant: "destructive",
      });
      setPaymentToDelete(null);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('payments.title')}</h1>
        <Button onClick={handleOpenAddDialog} className="bg-accent hover:bg-accent/90" disabled={workers.length === 0}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('payments.record.payment')}
        </Button>
      </div>
      <PaymentHistoryTable 
        workers={workers} 
        payments={payments} 
        onEdit={handleOpenEditDialog}
        onDelete={handleDeleteRequest}
      />
      <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPaymentToEdit(null);
          setIsPaymentDialogOpen(isOpen);
        }}
        onSavePayment={handleAddOrEditPayment}
        workers={workers}
        paymentToEdit={paymentToEdit}
      />
      <DeletePaymentDialog
        isOpen={!!paymentToDelete}
        onOpenChange={() => setPaymentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        payment={paymentToDelete}
        workerName={workers.find(w => w.id === paymentToDelete?.workerId)?.name || ''}
      />
    </div>
  );
}
