
'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Payment } from '@/lib/types';
import { format } from 'date-fns';

interface DeletePaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  payment: Payment | null;
  workerName: string;
}

export default function DeletePaymentDialog({ isOpen, onOpenChange, onConfirm, payment, workerName }: DeletePaymentDialogProps) {
    const { t } = useLanguage();
    
    if (!payment) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('dialog.delete.payment.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('dialog.delete.payment.description')
              .replace('{amount}', payment.amount.toString())
              .replace('{workerName}', workerName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('form.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t('dashboard.delete.worker')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
