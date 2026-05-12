'use client';
import { LanguageProvider } from '@/context/LanguageContext';
import GlobalFlashMessage from '@/components/GlobalFlashMessage';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <GlobalFlashMessage />
      {children}
    </LanguageProvider>
  );
}