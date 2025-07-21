'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkerList from '@/components/workers/WorkerList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import AddWorkerDialog from '@/components/workers/AddWorkerDialog';
import type { Worker } from '@/lib/types';
import { workers as initialWorkers } from '@/lib/data';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);

  const handleAddWorker = (newWorker: Omit<Worker, 'id' | 'photoUrl'>) => {
    const worker: Worker = {
      ...newWorker,
      id: `w${workers.length + 1}`,
      photoUrl: newWorker.photoUrl || `https://placehold.co/100x100.png`
    };
    setWorkers(prev => [...prev, worker]);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
        <Button onClick={() => setIsAddWorkerOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('dashboard.add.worker')}
        </Button>
      </div>

      <WorkerList workers={workers} />
      
      <AddWorkerDialog
        isOpen={isAddWorkerOpen}
        onOpenChange={setIsAddWorkerOpen}
        onAddWorker={handleAddWorker}
      />
    </div>
  );
}
