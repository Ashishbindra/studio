
'use client';
import { PlusCircle, Users, Wallet, Landmark, PiggyBank, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkerList from '@/components/workers/WorkerList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useMemo, useRef } from 'react';
import AddWorkerDialog from '@/components/workers/AddWorkerDialog';
import type { Worker, Payment, Attendance } from '@/lib/types';
import DeleteWorkerDialog from '@/components/workers/DeleteWorkerDialog';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import placeholderImages from '@/lib/placeholder-images.json';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);
  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [importFileData, setImportFileData] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  // Load data from localStorage on initial mount
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

  const summaryStats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const totalEarnedToday = workers.reduce((total, worker) => {
        const attendanceToday = attendances.find(a => a.workerId === worker.id && a.date === todayStr);
        if (attendanceToday) {
            if (attendanceToday.status === 'present') {
                return total + worker.dailyWage;
            }
            if (attendanceToday.status === 'half-day') {
                return total + worker.dailyWage / 2;
            }
        }
        return total;
    }, 0);
    
    const totalPaidToday = payments.filter(p => p.date === todayStr).reduce((sum, p) => sum + p.amount, 0);

    const totalEarned = workers.reduce((acc, worker) => {
        const workerAttendances = attendances.filter(a => a.workerId === worker.id);
        const presentDays = workerAttendances.filter(a => a.status === 'present').length;
        const halfDays = workerAttendances.filter(a => a.status === 'half-day').length;
        return acc + (presentDays * worker.dailyWage) + (halfDays * worker.dailyWage / 2);
    }, 0);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = totalEarned - totalPaid;

    return {
        totalWorkers: workers.length,
        totalEarnedToday,
        totalPaidToday,
        totalDue
    };
  }, [workers, attendances, payments]);


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
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      const newWorker: Worker = {
        ...workerData,
        photoUrl: workerData.photoUrl || randomImage.url,
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

  const handleExportData = () => {
    try {
      const allData = {
        workers: JSON.parse(localStorage.getItem('workers') || '[]'),
        allAttendance: JSON.parse(localStorage.getItem('allAttendance') || '{}'),
        payments: JSON.parse(localStorage.getItem('payments') || '[]'),
      };
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shramik-hisab-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Data Exported', description: 'Your data has been downloaded successfully.' });
    } catch (error) {
      console.error('Export failed:', error);
      toast({ title: 'Export Failed', description: 'Could not export your data.', variant: 'destructive' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setImportFileData(content);
          setIsImportConfirmOpen(true);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if(event.target) event.target.value = '';
  };
  
  const handleImportConfirm = () => {
    if (importFileData) {
      try {
        const importedData = JSON.parse(importFileData);
        if (importedData.workers && importedData.allAttendance && importedData.payments) {
          localStorage.setItem('workers', JSON.stringify(importedData.workers));
          localStorage.setItem('allAttendance', JSON.stringify(importedData.allAttendance));
          localStorage.setItem('payments', JSON.stringify(importedData.payments));
          toast({ title: 'Import Successful', description: 'Data has been restored. The page will now reload.' });
          setTimeout(() => window.location.reload(), 2000);
        } else {
          throw new Error('Invalid backup file structure.');
        }
      } catch (error) {
        console.error('Import failed:', error);
        toast({ title: 'Import Failed', description: 'The selected file is not a valid backup file.', variant: 'destructive' });
      }
    }
    setIsImportConfirmOpen(false);
    setImportFileData(null);
  };
  
  const handleResetConfirm = () => {
    try {
      localStorage.removeItem('workers');
      localStorage.removeItem('allAttendance');
      localStorage.removeItem('payments');
      localStorage.removeItem('language');
      localStorage.removeItem('translations_hi');
      toast({ title: 'Data Reset', description: 'All application data has been cleared. The page will now reload.' });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Data reset failed:', error);
      toast({ title: 'Reset Failed', description: 'Could not reset application data.', variant: 'destructive' });
    }
    setIsResetConfirmOpen(false);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
        <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportData} variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Export Data
            </Button>
             <Button onClick={handleImportClick} variant="outline">
                <Upload className="mr-2 h-5 w-5" />
                Import Data
            </Button>
             <Button onClick={() => setIsResetConfirmOpen(true)} variant="destructive">
                <Trash2 className="mr-2 h-5 w-5" />
                Reset Data
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
            />
            <Button onClick={handleOpenAddDialog} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-5 w-5" />
                {t('dashboard.add.worker')}
            </Button>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{summaryStats.totalWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned Today</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{summaryStats.totalEarnedToday.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Today</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{summaryStats.totalPaidToday.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance Due</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-headline ${summaryStats.totalDue >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              ₹{Math.abs(summaryStats.totalDue).toLocaleString()}
            </div>
          </CardContent>
        </Card>
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

      <AlertDialog open={isImportConfirmOpen} onOpenChange={setIsImportConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently overwrite all your current data with the data from the backup file. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setImportFileData(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleImportConfirm} className="bg-destructive hover:bg-destructive/90">
                    Yes, import data
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete all application data, including workers, attendance, and payments. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetConfirm} className="bg-destructive hover:bg-destructive/90">
                    Yes, reset data
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );

    


    