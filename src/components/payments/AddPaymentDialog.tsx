
'use client';
import { useEffect } from 'react';
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
import type { Worker, Payment } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSavePayment: (payment: Omit<Payment, 'id' | 'date'> & { date: string }) => void;
  workers: Worker[];
  paymentToEdit: Payment | null;
}

const paymentSchema = z.object({
  workerId: z.string().min(1, { message: 'Please select a worker.' }),
  amount: z.coerce.number().positive({ message: 'Payment amount must be a positive number.' }),
  date: z.date({ required_error: "Please select a date." }),
  note: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function AddPaymentDialog({ isOpen, onOpenChange, onSavePayment, workers, paymentToEdit }: AddPaymentDialogProps) {
  const { t } = useLanguage();
  const isEditing = !!paymentToEdit;
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const workerId = watch("workerId");
  const date = watch("date");

  useEffect(() => {
    if (isOpen) {
      if (paymentToEdit) {
        setValue('workerId', paymentToEdit.workerId);
        setValue('amount', paymentToEdit.amount);
        setValue('date', new Date(paymentToEdit.date));
        setValue('note', paymentToEdit.note || '');
      } else {
        reset({ workerId: '', amount: undefined, note: '', date: new Date() });
      }
    }
  }, [isOpen, paymentToEdit, setValue, reset]);

  const onSubmit = (data: PaymentFormData) => {
    onSavePayment({
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? t('dialog.edit.payment.title') : t('dialog.record.payment.title')}</DialogTitle>
          <DialogDescription>{isEditing ? t('dialog.edit.payment.description') : t('dialog.record.payment.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workerId" className="text-right">{t('form.worker.label')}</Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setValue('workerId', value, { shouldValidate: true })} value={workerId} disabled={isEditing}>
                    <SelectTrigger id="workerId">
                        <SelectValue placeholder={t('form.worker.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {workers.map(worker => (
                            <SelectItem key={worker.id} value={worker.id}>{worker.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.workerId && <p className="text-red-500 text-xs mt-1">{errors.workerId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">{t('form.payment.amount.label')}</Label>
              <div className="col-span-3">
                <Input id="amount" type="number" {...register('amount')} placeholder={t('form.payment.amount.placeholder')} />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="date" className="text-right">{t('attendance.date.label')}</Label>
               <div className="col-span-3">
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>{t('attendance.date.label')}</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setValue('date', d, { shouldValidate: true })}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
                 {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
               </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">{t('form.payment.note.label')}</Label>
              <div className="col-span-3">
                <Textarea id="note" {...register('note')} placeholder={t('form.payment.note.placeholder')} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('form.cancel')}</Button>
            <Button type="submit">{t('form.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
