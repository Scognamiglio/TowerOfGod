'use client';
import React, { useEffect, useState } from 'react';
import FlashMessage from './FlashMessage';
import { useLanguage } from '@/context/LanguageContext';

export default function GlobalFlashMessage() {
  const [flash, setFlash] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleFlash = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; type: 'success' | 'error' }>;
      const messageKey = customEvent.detail.key;
      if (messageKey) {
        const keyToTranslate = messageKey.includes('.') ? messageKey : `api.${messageKey}`;
        setFlash({ message: t(keyToTranslate), type: customEvent.detail.type });
      }
    };

    window.addEventListener('app-flash-message', handleFlash);
    return () => window.removeEventListener('app-flash-message', handleFlash);
  }, [t]);

  if (!flash) return null;

  return (
    <FlashMessage 
      message={flash.message} 
      type={flash.type} 
      onClose={() => setFlash(null)} 
    />
  );
}
