
'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Worker, Attendance } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '../ui/button';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WorkerCardProps {
  worker: Worker;
  attendances: Attendance[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

export default function WorkerCard({ worker, attendances, onEdit, onDelete }: WorkerCardProps) {
  const { t } = useLanguage();

  const presentDays = attendances.filter(a => a.status === 'present').length;
  const halfDays = attendances.filter(a => a.status === 'half-day').length;
  const absentDays = attendances.filter(a => a.status === 'absent').length;
  const hasAttendance = attendances.length > 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 rounded-lg bg-card/50 border-primary/20 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Image
          src={worker.photoUrl}
          alt={worker.name}
          width={64}
          height={64}
          className="rounded-full border-2 border-primary/50 object-cover"
          data-ai-hint={(worker as any).dataAiHint || 'person'}
        />
        <div className="flex-1">
          <CardTitle className="text-lg font-headline font-bold">{worker.name}</CardTitle>
          <p className="text-sm text-primary/80">₹{worker.dailyWage} {t('worker.wage.per.day')}</p>
           {worker.createdAt && (
             <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3 mr-1.5" />
                Joined on {format(new Date(worker.createdAt), 'do MMM yyyy')}
            </div>
           )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="font-bold text-2xl text-green-400">{presentDays}</p>
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('status.present')}</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-yellow-400">{halfDays}</p>
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('attendance.status.half-day')}</p>
          </div>
          <div>
            <p className="font-bold text-2xl text-red-500">{absentDays}</p>
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('attendance.status.absent')}</p>
          </div>
        </div>
      </CardContent>
       <CardFooter className="p-2 border-t border-white/10">
        <div className="flex w-full justify-end gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(worker)} className="hover:bg-primary/20 hover:text-primary">
                <Pencil className="h-4 w-4"/>
                <span className="sr-only">Edit</span>
            </Button>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="inline-block">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-400 hover:bg-destructive/20" 
                                onClick={() => onDelete(worker)}
                                disabled={hasAttendance}
                            >
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </TooltipTrigger>
                    {hasAttendance && (
                        <TooltipContent>
                            <p>Cannot delete a worker with attendance records.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
