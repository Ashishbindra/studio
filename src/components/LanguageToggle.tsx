'use client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage, t, loading } = useLanguage();

  const handleToggle = (checked: boolean) => {
    setLanguage(checked ? 'hi' : 'en');
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-switch">English</Label>
      <Switch
        id="language-switch"
        checked={language === 'hi'}
        onCheckedChange={handleToggle}
        disabled={loading}
        aria-label="Toggle language between English and Hindi"
      />
      <Label htmlFor="language-switch">{t('language.toggle.label')}</Label>
    </div>
  );
}
