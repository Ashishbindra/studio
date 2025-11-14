
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
import { Button } from '../ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface PaymentHistoryTableProps {
  workers: Worker[];
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

export default function PaymentHistoryTable({ workers, payments, onEdit, onDelete }: PaymentHistoryTableProps) {
  const { t } = useLanguage();

  const workerMap = new Map(workers.map(w => [w.id, w]));

  const validPayments = payments.filter(p => workerMap.has(p.workerId));

  if (validPayments.length === 0) {
    return <div className="text-center text-muted-foreground mt-10">No payment records found.</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('payments.table.worker')}</TableHead>
            <TableHead>{t('attendance.date.label')}</TableHead>
            <TableHead>{t('form.payment.note.label')}</TableHead>
            <TableHead className="text-right">{t('form.payment.amount.label')}</TableHead>
            <TableHead className="w-[50px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validPayments.map(payment => {
            const worker = workerMap.get(payment.workerId);
            return (
                <TableRow key={payment.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        {worker && <Image src={worker.photoUrl} alt={worker.name} width={32} height={32} className="rounded-full" />}
                        {worker?.name}
                    </TableCell>
                    <TableCell>{format(new Date(payment.date), 'PPP')}</TableCell>
                    <TableCell>{payment.note || '-'}</TableCell>
                    <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(payment)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(payment)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
