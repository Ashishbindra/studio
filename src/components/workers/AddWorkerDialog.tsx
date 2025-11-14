
'use client';
import { useEffect, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Worker } from '@/lib/types';
import placeholderImages from '@/lib/placeholder-images.json';

interface AddWorkerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveWorker: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
  workerToEdit: Worker | null;
}

const workerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
  dailyWage: z.coerce.number().positive({ message: 'Daily wage must be a positive number.' }),
  photoUrl: z.string().url().optional(), // Make optional for the form, will be handled separately
});

type WorkerFormData = z.infer<typeof workerSchema>;

export default function AddWorkerDialog({ isOpen, onOpenChange, onSaveWorker, workerToEdit }: AddWorkerDialogProps) {
  const { t } = useLanguage();
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      dailyWage: undefined,
      photoUrl: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
        if (workerToEdit) {
            setValue('name', workerToEdit.name);
            setValue('phoneNumber', workerToEdit.phoneNumber);
            setValue('dailyWage', workerToEdit.dailyWage);
            setValue('photoUrl', workerToEdit.photoUrl);
        } else {
            reset();
            const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
            setValue('photoUrl', randomImage.url);
        }
    }
  }, [isOpen, workerToEdit, setValue, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };
  
  const onSubmit = (data: WorkerFormData) => {
    onSaveWorker(data as Omit<Worker, 'id' | 'createdAt'>);
  };

  const isEditing = !!workerToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
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

            <div className="space-y-1">
              <Label htmlFor="name">{t('form.name.label')}</Label>
              <Input id="name" {...register('name')} placeholder={t('form.name.placeholder')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phoneNumber">{t('form.phone.label')}</Label>
              <Input id="phoneNumber" {...register('phoneNumber')} placeholder={t('form.phone.placeholder')} />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="dailyWage">{t('form.daily.wage.label')}</Label>
              <Input id="dailyWage" type="number" {...register('dailyWage')} placeholder={t('form.daily.wage.placeholder')} />
              {errors.dailyWage && <p className="text-red-500 text-xs mt-1">{errors.dailyWage.message}</p>}
            </div>

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
