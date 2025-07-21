'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Worker, Attendance, Payment } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Phone, Wallet, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkerCardProps {
  worker: Worker;
  attendances: Attendance[];
  payments: Payment[];
  onDelete: (worker: Worker) => void;
}

export default function WorkerCard({ worker, attendances, payments, onDelete }: WorkerCardProps) {
  const { t } = useLanguage();

  const presentDays = attendances.filter(a => a.status === 'present').length;
  const totalDue = presentDays * worker.dailyWage;
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = totalPaid - totalDue;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Image
          src={worker.photoUrl}
          alt={worker.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary/50 object-cover"
          data-ai-hint={(worker as any).dataAiHint}
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{worker.name}</CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <Phone className="h-4 w-4" />
            <span>{worker.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <Wallet className="h-4 w-4" />
            <span>₹{worker.dailyWage}{t('worker.wage.per.day')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <Separator className="mb-4" />
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-muted-foreground">{t('worker.due')}</p>
            <p className="font-semibold text-lg">₹{totalDue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('worker.paid')}</p>
            <p className="font-semibold text-lg">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('worker.balance')}</p>
            <p 
              className={cn(
                'font-bold text-lg',
                balance < 0 ? 'text-red-500' : 'text-green-600'
              )}
            >
              ₹{Math.abs(balance).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button variant="outline" size="sm" disabled>
          <Pencil className="mr-2 h-4 w-4" />
          {t('dashboard.edit.worker')}
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(worker)}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t('dashboard.delete.worker')}
        </Button>
      </CardFooter>
    </Card>
  );
}
