
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { cn } from '@/lib/utils';
import { Sheet, Waypoints, CreditCard, UserCog } from 'lucide-react';

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', labelKey: 'nav.dashboard', icon: <Sheet className="h-5 w-5" /> },
    { href: '/attendance', labelKey: 'nav.attendance', icon: <Waypoints className="h-5 w-5" /> },
    { href: '/payments', labelKey: 'nav.payments', icon: <CreditCard className="h-5 w-5" /> },
    { href: '/worker-payment', labelKey: 'nav.worker.payment', icon: <UserCog className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 fill-primary">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a40,40,0,0,1-80,0,8,8,0,0,1,16,0,24,24,0,1,0,24,24,8,8,0,0,1,0,16,40,40,0,0,1-40-40,8,8,0,0,1,8-8,24,24,0,1,0-24-24,8,8,0,0,1,0-16A40,40,0,0,1,168,128Z"></path>
            </svg>
            <span className="font-bold font-headline hidden sm:inline-block">{t('app.title')}</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground font-semibold' : 'text-foreground/60'
              )}
            >
              {link.icon}
              <span className="hidden md:inline-block">{t(link.labelKey as any)}</span>
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
