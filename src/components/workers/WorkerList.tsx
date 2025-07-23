'use client';
import type { Worker, Attendance } from '@/lib/types';
import WorkerCard from './WorkerCard';
import { useState, useEffect } from 'react';
import { attendances as initialAttendances } from '@/lib/data';

interface WorkerListProps {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

export default function WorkerList({ workers, onEdit, onDelete }: WorkerListProps) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  
  useEffect(() => {
    const savedAttendances = localStorage.getItem('allAttendance');
    if(savedAttendances) {
        const parsedAttendance = JSON.parse(savedAttendances);
        const newAttendances: Attendance[] = [];
        Object.entries(parsedAttendance).forEach(([date, dateRecords]) => {
            Object.entries(dateRecords as any).forEach(([workerId, record]) => {
                newAttendances.push({
                    id: `att-${date}-${workerId}`,
                    workerId,
                    date,
                    status: (record as any).status,
                    checkIn: (record as any).checkIn ? new Date((record as any).checkIn) : undefined,
                    checkOut: (record as any).checkOut ? new Date((record as any).checkOut) : undefined,
                });
            });
        });

        const uniqueAttendances = new Map<string, Attendance>();
        initialAttendances.forEach(att => uniqueAttendances.set(`${att.date}-${att.workerId}`, att));
        newAttendances.forEach(att => uniqueAttendances.set(`${att.date}-${att.workerId}`, att));
        setAttendances(Array.from(uniqueAttendances.values()));

    } else {
        setAttendances(initialAttendances);
    }
  }, [workers]);


  if (workers.length === 0) {
    return <div className="text-center text-muted-foreground mt-10">No workers found. Add one to get started!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workers.map((worker) => {
        const workerAttendances = attendances.filter(a => a.workerId === worker.id);
        
        return (
          <WorkerCard 
            key={worker.id}
            worker={worker}
            attendances={workerAttendances}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      })}
    </div>
  );
}
