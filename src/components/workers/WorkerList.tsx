'use client';
import { attendances, payments } from '@/lib/data';
import type { Worker } from '@/lib/types';
import WorkerCard from './WorkerCard';

interface WorkerListProps {
  workers: Worker[];
}

export default function WorkerList({ workers }: WorkerListProps) {
  if (workers.length === 0) {
    return <div className="text-center text-muted-foreground mt-10">No workers found. Add one to get started!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workers.map((worker) => {
        const workerAttendances = attendances.filter(a => a.workerId === worker.id);
        const workerPayments = payments.filter(p => p.workerId === worker.id);
        
        return (
          <WorkerCard 
            key={worker.id}
            worker={worker}
            attendances={workerAttendances}
            payments={workerPayments}
          />
        )
      })}
    </div>
  );
}
