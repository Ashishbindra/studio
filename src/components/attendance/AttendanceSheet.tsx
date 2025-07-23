'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, Clock, LogIn, LogOut, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { workers as initialWorkers, attendances as initialAttendances } from '@/lib/data';
import type { Attendance, Worker } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import HistorySheet from '@/components/attendance/HistorySheet';

type DailyAttendance = Pick<Attendance, 'status' | 'checkIn' | 'checkOut'>;

export default function AttendanceSheet() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allAttendance, setAllAttendance] = useState<Record<string, Record<string, DailyAttendance>>>({});
  const [historyWorker, setHistoryWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const savedWorkers = localStorage.getItem('workers');
    if (savedWorkers) {
        setWorkers(JSON.parse(savedWorkers));
    } else {
        setWorkers(initialWorkers);
    }

    const savedAttendance = localStorage.getItem('allAttendance');
    if (savedAttendance) {
        const parsedAttendance = JSON.parse(savedAttendance);
        // Date objects need to be reconstructed
        Object.keys(parsedAttendance).forEach(date => {
            Object.keys(parsedAttendance[date]).forEach(workerId => {
                const record = parsedAttendance[date][workerId];
                if (record.checkIn) record.checkIn = new Date(record.checkIn);
                if (record.checkOut) record.checkOut = new Date(record.checkOut);
            });
        });
        setAllAttendance(parsedAttendance);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allAttendance', JSON.stringify(allAttendance));
  }, [allAttendance]);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const attendanceForSelectedDate = allAttendance[formattedDate] || {};

  const combinedAttendances = useMemo(() => {
    const newAttendances: Attendance[] = [];
    Object.entries(allAttendance).forEach(([date, dateRecords]) => {
      Object.entries(dateRecords).forEach(([workerId, record]) => {
        newAttendances.push({
          id: `att-${date}-${workerId}`,
          workerId,
          date,
          status: record.status,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
        });
      });
    });

    const uniqueAttendances = new Map<string, Attendance>();
    initialAttendances.forEach(att => uniqueAttendances.set(`${att.date}-${att.workerId}`, att));
    newAttendances.forEach(att => uniqueAttendances.set(`${att.date}-${att.workerId}`, att));

    return Array.from(uniqueAttendances.values());

  }, [allAttendance]);

  const handleAttendance = (workerId: string, status: 'present' | 'absent') => {
    setAllAttendance(prev => {
      const newDateRecords = { ...prev[formattedDate] };
      
      const newRecord: DailyAttendance = {
        status,
        checkIn: status === 'present' ? new Date() : undefined,
      };

      newDateRecords[workerId] = newRecord;

      return {
        ...prev,
        [formattedDate]: newDateRecords
      };
    });
    toast({
      title: `Marked ${status}`,
      description: `${workers.find(w => w.id === workerId)?.name} marked as ${status}.`
    });
  };

  const handleCheckOut = (workerId: string) => {
    setAllAttendance(prev => {
      const newDateRecords = { ...prev[formattedDate] };
      
      newDateRecords[workerId] = {
        ...newDateRecords[workerId],
        checkOut: new Date(),
      };

      return {
        ...prev,
        [formattedDate]: newDateRecords
      };
    });
     toast({
      title: "Checked Out",
      description: `${workers.find(w => w.id === workerId)?.name} has been checked out.`
    });
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-6">
            <h2 className="text-xl font-semibold font-headline">{t('attendance.date.label')}</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full md:w-[280px] justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-4">
            {workers.map((worker: Worker) => {
              const record = attendanceForSelectedDate[worker.id];
              return (
                <div key={worker.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <Image
                      src={worker.photoUrl}
                      alt={worker.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                      data-ai-hint={(worker as any).dataAiHint}
                    />
                    <div>
                      <p className="font-semibold">{worker.name}</p>
                      <p className="text-sm text-muted-foreground">₹{worker.dailyWage}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-2">
                      {!record && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleAttendance(worker.id, 'present')} className="bg-green-600 hover:bg-green-700 text-white">
                            <LogIn className="mr-2 h-4 w-4" />{t('attendance.mark.present')}
                          </Button>
                          <Button onClick={() => handleAttendance(worker.id, 'absent')} variant="destructive">
                            <LogOut className="mr-2 h-4 w-4" />{t('attendance.mark.absent')}
                          </Button>
                        </div>
                      )}
                      {record?.status === 'present' && (
                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                           <div className="flex items-center gap-2 text-green-600">
                              <Clock className="h-4 w-4" />
                              <span>{t('attendance.checked.in.at')} {record.checkIn ? format(record.checkIn, 'p') : ''}</span>
                          </div>
                          {record.checkOut ? (
                               <div className="flex items-center gap-2 text-red-500">
                                  <Clock className="h-4 w-4" />
                                  <span>{t('attendance.checked.out.at')} {format(record.checkOut, 'p')}</span>
                              </div>
                          ) : (
                              <Button onClick={() => handleCheckOut(worker.id)} size="sm" variant="outline">
                                  <LogOut className="mr-2 h-4 w-4" />{t('attendance.check.out')}
                              </Button>
                          )}
                        </div>
                      )}
                      {record?.status === 'absent' && (
                        <div className="text-red-500 font-medium text-sm">{t('attendance.status.absent')}</div>
                      )}
                      <Button variant="ghost" size="sm" className="ml-2" onClick={() => setHistoryWorker(worker)}>
                        <History className="mr-2 h-4 w-4" />
                        View History
                      </Button>
                  </div>

                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <HistorySheet
        worker={historyWorker}
        allAttendances={combinedAttendances}
        isOpen={!!historyWorker}
        onOpenChange={() => setHistoryWorker(null)}
      />
    </>
  );
}
