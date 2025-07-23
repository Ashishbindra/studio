'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import type { Worker, Attendance } from '@/lib/types';
import AttendanceHistorySheet from '@/components/attendance/AttendanceHistorySheet';

interface HistorySheetProps {
  worker: Worker | null;
  allAttendances: Attendance[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function HistorySheet({ worker, allAttendances, isOpen, onOpenChange }: HistorySheetProps) {
  if (!worker) return null;

  const workerAttendances = allAttendances.filter(a => a.workerId === worker.id);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Attendance History for {worker.name}</SheetTitle>
          <SheetDescription>
            A complete log of attendance records for {worker.name}.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <AttendanceHistorySheet attendances={workerAttendances} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
