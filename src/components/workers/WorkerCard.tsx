'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Worker, Attendance } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkerCardProps {
  worker: Worker;
  attendances: Attendance[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

export default function WorkerCard({ worker, attendances }: WorkerCardProps) {
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
          data-ai-hint={(worker as any).dataAiHint}
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{worker.name}</CardTitle>
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
    </Card>
  );
}
