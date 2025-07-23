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
import type { Worker, Payment, Attendance } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkerPaymentTableProps {
  workers: Worker[];
  payments: Payment[];
  attendances: Attendance[];
}

export default function WorkerPaymentTable({ workers, payments, attendances }: WorkerPaymentTableProps) {
  const { t } = useLanguage();

  const paymentSummary = workers.map(worker => {
    const workerAttendances = attendances.filter(a => a.workerId === worker.id && a.status === 'present');
    const presentDays = workerAttendances.length;
    const totalEarned = presentDays * worker.dailyWage;

    const workerPayments = payments.filter(p => p.workerId === worker.id);
    const totalPaid = workerPayments.reduce((sum, p) => sum + p.amount, 0);

    const balance = totalEarned - totalPaid;

    return {
      ...worker,
      presentDays,
      totalEarned,
      totalPaid,
      balance,
    };
  });

  if (workers.length === 0) {
    return <div className="text-center text-muted-foreground mt-10">No workers found.</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('worker.payment.table.worker')}</TableHead>
            <TableHead className="text-center">{t('worker.payment.table.present.days')}</TableHead>
            <TableHead className="text-right">{t('worker.payment.table.total.earned')}</TableHead>
            <TableHead className="text-right">{t('worker.payment.table.total.paid')}</TableHead>
            <TableHead className="text-right">{t('worker.payment.table.balance')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentSummary.map(summary => (
            <TableRow key={summary.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <Image
                  src={summary.photoUrl}
                  alt={summary.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  data-ai-hint={(summary as any).dataAiHint || 'person'}
                />
                {summary.name}
              </TableCell>
              <TableCell className="text-center">{summary.presentDays}</TableCell>
              <TableCell className="text-right">₹{summary.totalEarned.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{summary.totalPaid.toLocaleString()}</TableCell>
              <TableCell className="text-right font-semibold">
                 <Badge
                  className={cn('text-xs', {
                    'bg-green-100 text-green-800 border-green-300': summary.balance <= 0,
                    'bg-red-100 text-red-800 border-red-300': summary.balance > 0,
                  })}
                  variant="outline"
                >
                  {summary.balance > 0 ? `Due: ₹${summary.balance.toLocaleString()}`: (summary.balance < 0 ? `Adv: ₹${(-summary.balance).toLocaleString()}` : 'Settled')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
