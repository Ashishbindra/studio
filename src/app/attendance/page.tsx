
'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import AttendanceSheet from '@/components/attendance/AttendanceSheet';

export default function AttendancePage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('attendance.title')}</h1>
      </div>
      <AttendanceSheet />
    </div>
  );
}
