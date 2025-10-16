'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Attendance } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AttendanceHistorySheetProps {
  attendances: Attendance[];
}

export default function AttendanceHistorySheet({ attendances }: AttendanceHistorySheetProps) {
  const { t } = useLanguage();

  if (attendances.length === 0) {
    return <p className="text-center text-muted-foreground p-4">No attendance records found for this worker.</p>;
  }
  
  const getStatusKey = (status: 'present' | 'absent' | 'half-day'): 'status.present' | 'attendance.status.absent' | 'attendance.status.half-day' => {
    switch (status) {
        case 'present': return 'status.present';
        case 'absent': return 'attendance.status.absent';
        case 'half-day': return 'attendance.status.half-day';
    }
  }


  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map(record => (
            <TableRow key={record.id}>
              <TableCell>{format(new Date(record.date), 'PPP')}</TableCell>
              <TableCell>
                <Badge 
                  className={cn({
                    'bg-green-600': record.status === 'present',
                    'bg-red-600': record.status === 'absent',
                    'bg-yellow-500': record.status === 'half-day',
                  })}
                >
                  {t(getStatusKey(record.status))}
                </Badge>
              </TableCell>
              <TableCell>{record.checkIn ? format(new Date(record.checkIn), 'p') : 'N/A'}</TableCell>
              <TableCell>{record.checkOut ? format(new Date(record.checkOut), 'p') : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
