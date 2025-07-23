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
import { Badge } from '@/components/ui/badge';
import type { Worker, Attendance, Payment } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface PaymentListProps {
  workers: Worker[];
  attendances: Attendance[];
  payments: Payment[];
}

export default function PaymentList({ workers, attendances, payments }: PaymentListProps) {
  const { t } = useLanguage();

  const paymentData = useMemo(() => workers.map(worker => {
    const workerAttendances = attendances.filter(a => a.workerId === worker.id);
    const workerPayments = payments.filter(p => p.workerId === worker.id);
    const presentDays = workerAttendances.filter(a => a.status === 'present').length;
    const totalDue = presentDays * worker.dailyWage;
    const totalPaid = workerPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalPaid - totalDue;
    return { ...worker, totalDue, totalPaid, balance };
  }), [workers, attendances, payments]);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]"></TableHead>
            <TableHead>{t('payments.table.worker')}</TableHead>
            <TableHead className="text-right">{t('worker.due')}</TableHead>
            <TableHead className="text-right">{t('worker.paid')}</TableHead>
            <TableHead className="text-right">{t('worker.balance')}</TableHead>
            <TableHead className="text-center">{t('payments.table.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentData.map(worker => (
            <TableRow key={worker.id}>
              <TableCell>
                <Image
                  src={worker.photoUrl}
                  alt={worker.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  data-ai-hint={(worker as any).dataAiHint}
                />
              </TableCell>
              <TableCell className="font-medium">{worker.name}</TableCell>
              <TableCell className="text-right">₹{worker.totalDue.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{worker.totalPaid.toLocaleString()}</TableCell>
              <TableCell className={cn(
                'text-right font-bold',
                worker.balance < 0 ? 'text-red-500' : 'text-green-600'
              )}>
                ₹{Math.abs(worker.balance).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                {worker.balance < 0 ? (
                  <Badge variant="destructive">{t('payments.status.due')}</Badge>
                ) : (
                  <Badge className="bg-green-600">{t('payments.status.paid')}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
