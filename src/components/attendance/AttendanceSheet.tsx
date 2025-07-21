'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { workers } from '@/lib/data';
import type { Attendance, Worker } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

type DailyAttendance = Omit<Attendance, 'id' | 'workerId' | 'date'>;

export default function AttendanceSheet() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, DailyAttendance>>({});

  useEffect(() => {
    // Here you would typically fetch attendance for the selected date
    // For now, we'll reset the state when the date changes
    setAttendanceRecords({});
  }, [selectedDate]);

  const handleAttendance = (workerId: string, status: 'present' | 'absent') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [workerId]: {
        status,
        checkIn: status === 'present' ? new Date() : undefined,
      }
    }));
  };

  const handleCheckOut = (workerId: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        checkOut: new Date(),
      }
    }));
  };

  return (
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
            const record = attendanceRecords[worker.id];
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
                        <span>{t('attendance.checked.in.at')} {format(record.checkIn!, 'p')}</span>
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
