import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import AuthModal from '@/components/AuthModal';

interface Props {
  onEnter: () => void;
}

export default function WelcomeScreen({ onEnter }: Props) {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
      <div className="absolute left-8 top-8">
        <LanguageSelector />
      </div>
      <div className="absolute right-8 top-8">
        <button
          onClick={() => setAuthOpen(true)}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-100 transition hover:border-indigo-500/50 hover:text-indigo-300"
        >
          {t('auth.button')}
        </button>
      </div>

      <div className="space-y-2 mb-12">
        <h1 className="text-6xl font-black italic tracking-tighter text-white">
          {t('welcome.farm')}<span className="text-indigo-600">{t('welcome.core')}</span>
        </h1>
        <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-xs">
          {t('welcome.tagline')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        <button 
          onClick={onEnter}
          className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl transition-all hover:border-indigo-500/50 hover:bg-slate-900/50 text-left"
        >
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400">
            {t('welcome.links_title')}
          </h2>
          <p className="text-sm text-slate-500">{t('welcome.links_desc')}</p>
        </button>
      </div>

      <footer className="mt-20 text-[10px] text-slate-700 font-mono uppercase tracking-widest">
        {t('welcome.footer')}
      </footer>

      <AuthModal visible={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}