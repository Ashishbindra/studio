'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Worker, Attendance } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  attendances: Attendance[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

export default function WorkerCard({ worker, attendances, onEdit, onDelete }: WorkerCardProps) {
  const { t } = useLanguage();

  const presentDays = attendances.filter(a => a.status === 'present').length;
  const absentDays = attendances.filter(a => a.status === 'absent').length;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Image
          src={worker.photoUrl}
          alt={worker.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary/50 object-cover"
          data-ai-hint={(worker as any).dataAiHint || 'person'}
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{worker.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{worker.phoneNumber}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div>
            <p className="text-muted-foreground">{t('status.present')}</p>
            <p className="font-semibold text-lg text-green-600">{presentDays}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('attendance.status.absent')}</p>
            <p className="font-semibold text-lg text-red-500">{absentDays}</p>
          </div>
        </div>
      </CardContent>
       <CardFooter className="p-2 bg-card/50">
        <div className="flex w-full justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(worker)}>
                <Pencil className="mr-2 h-4 w-4"/>
                {t('dashboard.edit.worker')}
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(worker)}>
                <Trash2 className="mr-2 h-4 w-4"/>
                {t('dashboard.delete.worker')}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
