'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Worker } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

interface AddWorkerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveWorker: (worker: Omit<Worker, 'id'>) => void;
  workerToEdit: Worker | null;
}

const workerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
  dailyWage: z.coerce.number().positive({ message: 'Daily wage must be a positive number.' }),
  photoUrl: z.string().url({ message: 'Please provide a valid photo URL.' }),
});

type WorkerFormData = z.infer<typeof workerSchema>;

export default function AddWorkerDialog({ isOpen, onOpenChange, onSaveWorker, workerToEdit }: AddWorkerDialogProps) {
  const { t } = useLanguage();
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const { control, register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      dailyWage: undefined,
      photoUrl: '',
    }
  });

  const photoUrl = watch('photoUrl');

  useEffect(() => {
    if (isOpen) {
        if (workerToEdit) {
            setValue('name', workerToEdit.name);
            setValue('phoneNumber', workerToEdit.phoneNumber);
            setValue('dailyWage', workerToEdit.dailyWage);
            setValue('photoUrl', workerToEdit.photoUrl);
            setPhotoPreview(workerToEdit.photoUrl);
        } else {
            reset();
            setPhotoPreview('');
        }
    }
  }, [isOpen, workerToEdit, setValue, reset]);

  useEffect(() => {
    if (photoUrl) {
      setPhotoPreview(photoUrl);
    }
  }, [photoUrl]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setPhotoPreview('');
    }
    onOpenChange(open);
  };
  
  const generatePlaceholder = () => {
      const randomId = Math.floor(Math.random() * 1000);
      const url = `https://placehold.co/100x100.png?text=${randomId}`;
      setValue('photoUrl', url, { shouldValidate: true });
      setPhotoPreview(url);
  };

  const onSubmit = (data: WorkerFormData) => {
    onSaveWorker(data);
  };

  const isEditing = !!workerToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {isEditing ? t('dialog.edit.worker.title') : t('dialog.add.worker.title')}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t('dialog.edit.worker.description') : t('dialog.add.worker.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t('form.name.label')}</Label>
              <div className="col-span-3">
                <Input id="name" {...register('name')} placeholder={t('form.name.placeholder')} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">{t('form.phone.label')}</Label>
              <div className="col-span-3">
                <Input id="phoneNumber" {...register('phoneNumber')} placeholder={t('form.phone.placeholder')} />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dailyWage" className="text-right">{t('form.daily.wage.label')}</Label>
              <div className="col-span-3">
                <Input id="dailyWage" type="number" {...register('dailyWage')} placeholder={t('form.daily.wage.placeholder')} />
                {errors.dailyWage && <p className="text-red-500 text-xs mt-1">{errors.dailyWage.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label className="text-right">{t('form.photo.label')}</Label>
               <div className="col-span-3 flex items-center gap-2">
                 {photoPreview ? (
                    <Image src={photoPreview} alt="Worker photo" width={40} height={40} className="rounded-full" />
                 ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                 )}
                 <Button type="button" variant="outline" size="sm" onClick={generatePlaceholder}>
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    {t('form.generate.photo')}
                 </Button>
               </div>
            </div>
             {errors.photoUrl && <p className="col-span-4 text-red-500 text-xs mt-1 text-center">{errors.photoUrl.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>{t('form.cancel')}</Button>
            <Button type="submit">{t('form.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
