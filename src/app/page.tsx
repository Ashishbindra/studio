
'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkerList from '@/components/workers/WorkerList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import AddWorkerDialog from '@/components/workers/AddWorkerDialog';
import type { Worker } from '@/lib/types';
import DeleteWorkerDialog from '@/components/workers/DeleteWorkerDialog';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/AdBanner';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);
  const isInitialMount = useRef(true);
  
  // Load workers from localStorage on initial mount
  useEffect(() => {
    try {
      const savedWorkers = localStorage.getItem('workers');
      if (savedWorkers) {
        setWorkers(JSON.parse(savedWorkers));
      }
    } catch (error) {
      console.error("Failed to parse workers from localStorage", error);
    }
  }, []);

  // Save workers to localStorage whenever the workers state changes
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('workers', JSON.stringify(workers));
    } catch (error) {
      console.error("Failed to save workers to localStorage", error);
    }
  }, [workers]);

  const handleAddOrEditWorker = (workerData: Omit<Worker, 'id' | 'createdAt'>) => {
    if (workerToEdit) {
      setWorkers(prevWorkers => 
        prevWorkers.map(w =>
          w.id === workerToEdit.id ? { ...w, ...workerData } : w
        )
      );
      toast({
        title: t('toast.worker.updated.title'),
        description: t('toast.worker.updated.description').replace('{workerName}', workerData.name),
      });
    } else {
      const newWorker: Worker = {
        ...workerData,
        id: `w${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setWorkers(prev => [...prev, newWorker]);
      toast({
          title: t('toast.worker.added.title'),
          description: t('toast.worker.added.description').replace('{workerName}', newWorker.name),
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
        title: t('toast.worker.deleted.title'),
        description: t('toast.worker.deleted.description').replace('{workerName}', workerToDelete.name),
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
      
      <div className="mt-8">
        <AdBanner adSlot="5544315530" />
      </div>

      <AddWorkerDialog
        isOpen={isWorkerDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setWorkerToEdit(null);
          setIsWorkerDialogOpen(isOpen);
        }}
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
