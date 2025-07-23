'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Worker, Payment, Attendance } from '@/lib/types';
import WorkerPaymentTable from '@/components/worker-payment/WorkerPaymentTable';

export default function WorkerPaymentPage() {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    try {
      const savedWorkers = localStorage.getItem('workers');
      if (savedWorkers) {
        setWorkers(JSON.parse(savedWorkers));
      }
      
      const savedPayments = localStorage.getItem('payments');
      if (savedPayments) {
        setPayments(JSON.parse(savedPayments));
      }

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
          setAttendances(newAttendances);
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('worker.payment.title')}</h1>
      </div>
      <WorkerPaymentTable workers={workers} payments={payments} attendances={attendances} />
    </div>
  );
}
