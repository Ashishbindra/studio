'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkerList from '@/components/workers/WorkerList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import AddWorkerDialog from '@/components/workers/AddWorkerDialog';
import type { Worker } from '@/lib/types';
import DeleteWorkerDialog from '@/components/workers/DeleteWorkerDialog';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);

  useEffect(() => {
    const savedWorkers = localStorage.getItem('workers');
    if (savedWorkers) {
      setWorkers(JSON.parse(savedWorkers));
    }
  }, []);

  useEffect(() => {
    // This effect ensures that we don't overwrite the stored workers with an empty array on initial load
    if (workers.length > 0 || localStorage.getItem('workers')) {
        localStorage.setItem('workers', JSON.stringify(workers));
    }
  }, [workers]);

  const handleAddOrEditWorker = (workerData: Omit<Worker, 'id'>) => {
    if (workerToEdit) {
      // Editing existing worker
      const updatedWorkers = workers.map(w =>
        w.id === workerToEdit.id ? { ...w, ...workerData } : w
      );
      setWorkers(updatedWorkers);
      toast({
        title: "Worker Updated",
        description: `${workerData.name}'s details have been updated.`,
      });
    } else {
      // Adding new worker
      const newWorker: Worker = {
        ...workerData,
        id: `w${Date.now()}`,
      };
      setWorkers(prev => [...prev, newWorker]);
      toast({
          title: "Worker Added",
          description: `${newWorker.name} has been successfully added.`,
      });
    }
    setWorkerToEdit(null);
    setIsWorkerDialogOpen(false);
  };
  
  const handleOpenAddDialog = () => {
    setWorkerToEdit(null);
    setIsWorkerDialogOpen(true);
  };

  const handleOpenEditDialog = (worker: Worker) => {
    setWorkerToEdit(worker);
    setIsWorkerDialogOpen(true);
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
        <Button onClick={handleOpenAddDialog} className="bg-accent hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('dashboard.add.worker')}
        </Button>
      </div>

      <WorkerList workers={workers} onEdit={handleOpenEditDialog} onDelete={handleDeleteRequest} />
      
      <AddWorkerDialog
        isOpen={isWorkerDialogOpen}
        onOpenChange={setIsWorkerDialogOpen}
        onSaveWorker={handleAddOrEditWorker}
        workerToEdit={workerToEdit}
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
