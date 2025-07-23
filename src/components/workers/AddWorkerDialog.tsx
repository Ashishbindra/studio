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
  onSaveWorker: (worker: Omit<Worker, 'id' | 'dailyWage'> & { photoUrl: string, dailyWage: number }) => void;
  workerToEdit: Worker | null;
}

const workerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
  photoUrl: z.string().url().optional(),
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
      photoUrl: '',
    }
  });

  const photoUrlValue = watch('photoUrl');

  useEffect(() => {
    if (isOpen) {
        if (workerToEdit) {
            setValue('name', workerToEdit.name);
            setValue('phoneNumber', workerToEdit.phoneNumber);
            setValue('photoUrl', workerToEdit.photoUrl);
            setPhotoPreview(workerToEdit.photoUrl);
        } else {
            reset();
            const randomUrl = `https://placehold.co/100x100.png?text=${Math.random()}`;
            setValue('photoUrl', randomUrl);
            setPhotoPreview(randomUrl);
        }
    }
  }, [isOpen, workerToEdit, setValue, reset]);

  useEffect(() => {
    if (photoUrlValue) {
      setPhotoPreview(photoUrlValue);
    }
  }, [photoUrlValue]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setPhotoPreview('');
    }
    onOpenChange(open);
  };
  
  const generatePlaceholder = () => {
      const url = `https://placehold.co/100x100.png?text=${Math.random()}`;
      setValue('photoUrl', url, { shouldValidate: true, shouldDirty: true });
      setPhotoPreview(url);
  };

  const onSubmit = (data: WorkerFormData) => {
    onSaveWorker({
        ...data,
        dailyWage: 300,
        photoUrl: data.photoUrl || `https://placehold.co/100x100.png`
    });
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
