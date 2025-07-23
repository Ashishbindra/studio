'use client';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Worker, Payment } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface PaymentHistoryTableProps {
  workers: Worker[];
  payments: Payment[];
}

export default function PaymentHistoryTable({ workers, payments }: PaymentHistoryTableProps) {
  const { t } = useLanguage();

  const getWorkerName = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    return worker ? worker.name : 'Unknown Worker';
  };

  if (payments.length === 0) {
    return <div className="text-center text-muted-foreground mt-10">No payment records found.</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('payments.table.worker')}</TableHead>
            <TableHead>{t('attendance.date.label')}</TableHead>
            <TableHead className="text-right">{t('form.payment.amount.label')}</TableHead>
            <TableHead>{t('form.payment.note.label')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{getWorkerName(payment.workerId)}</TableCell>
              <TableCell>{format(new Date(payment.date), 'PPP')}</TableCell>
              <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
              <TableCell>{payment.note || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
