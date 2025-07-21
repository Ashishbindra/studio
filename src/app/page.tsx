'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkerList from '@/components/workers/WorkerList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import AddWorkerDialog from '@/components/workers/AddWorkerDialog';
import type { Worker } from '@/lib/types';
import { workers as initialWorkers } from '@/lib/data';
import DeleteWorkerDialog from '@/components/workers/DeleteWorkerDialog';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);

  const handleAddWorker = (newWorker: Omit<Worker, 'id' | 'photoUrl'>) => {
    const worker: Worker = {
      ...newWorker,
      id: `w${workers.length + 1}`,
      photoUrl: newWorker.photoUrl || `https://placehold.co/100x100.png`
    };
    setWorkers(prev => [...prev, worker]);
  };

  const handleDeleteRequest = (worker: Worker) => {
    setWorkerToDelete(worker);
  };

  const handleDeleteConfirm = () => {
    if (workerToDelete) {
      setWorkers(prev => prev.filter(w => w.id !== workerToDelete.id));
      toast({
        title: "Worker Deleted",
        description: `${workerToDelete.name} has been removed.`,
        variant: "destructive",
      });
      setWorkerToDelete(null);
    }
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

      <WorkerList workers={workers} onDelete={handleDeleteRequest} />
      
      <AddWorkerDialog
        isOpen={isAddWorkerOpen}
        onOpenChange={setIsAddWorkerOpen}
        onAddWorker={handleAddWorker}
      />

      <DeleteWorkerDialog
        isOpen={!!workerToDelete}
        onOpenChange={() => setWorkerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        workerName={workerToDelete?.name || ''}
      />
    </div>
  );
}
