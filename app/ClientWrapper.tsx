'use client';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}