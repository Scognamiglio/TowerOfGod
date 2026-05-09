import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import AuthModal from '@/components/AuthModal';
import JoinGuildModal from '@/components/JoinGuildModal';
import CreateGuildModal from '@/components/CreateGuildModal';
import FlashMessage from '@/components/FlashMessage';

interface Props {
  onEnter: () => void;
}

interface User {
  id: string;
  pseudo: string;
  role: string;
  guildName?: string;
  guildRank?: string;
}

export default function WelcomeScreen({ onEnter }: Props) {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showGuildOptions, setShowGuildOptions] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('farmcore_token');
    const userData = localStorage.getItem('farmcore_user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Vérifier si l'utilisateur est déjà connecté au montage du composant
  useEffect(checkLoginStatus, [checkLoginStatus]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logique de déconnexion
      localStorage.removeItem('farmcore_token');
      localStorage.removeItem('farmcore_user');
      setIsLoggedIn(false);
      setUser(null);
      setShowGuildOptions(false);
    } else {
      setAuthOpen(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
      {flash && <FlashMessage message={flash} onClose={() => setFlash(null)} />}

      <div className="absolute left-8 top-8">
        <LanguageSelector />
      </div>
      <div className="absolute right-8 top-8">
        <button
          onClick={handleAuthClick}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-100 transition hover:border-indigo-500/50 hover:text-indigo-300"
        >
          {isLoggedIn ? t('auth.logout') : t('auth.button')}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <button 
          onClick={onEnter}
          className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl transition-all hover:border-indigo-500/50 hover:bg-slate-900/50 text-left"
        >
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400">
            {t('welcome.links_title')}
          </h2>
          <p className="text-sm text-slate-500">{t('welcome.links_desc')}</p>
        </button>

        {isLoggedIn && (
          <button 
            onClick={() => setShowGuildOptions(!showGuildOptions)}
            className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl transition-all hover:border-emerald-500/50 hover:bg-slate-900/50 text-left"
          >
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400">
              {user?.guildName ? user.guildName : t('welcome.guild_title')}
            </h2>
            <p className="text-sm text-slate-500">
              {user?.guildName 
                ? `${t('welcome.guild_title')} • ${user.guildRank}` 
                : t('welcome.guild_no_guild_desc')}
            </p>
          </button>
        )}
      </div>

      {showGuildOptions && isLoggedIn && !user?.guildName && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <button 
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center p-4 rounded-2xl border border-slate-800 bg-slate-900 text-white font-bold hover:border-emerald-500 transition-colors"
          >
            {t('welcome.guild_create')}
          </button>
          <button 
            onClick={() => setJoinModalOpen(true)}
            className="flex items-center justify-center p-4 rounded-2xl border border-slate-800 bg-slate-900 text-white font-bold hover:border-sky-500 transition-colors"
          >
            {t('welcome.guild_join')}
          </button>
        </div>
      )}

      {showGuildOptions && isLoggedIn && user?.guildName && (
        <div className="mt-8 p-6 rounded-3xl border border-slate-800 bg-slate-900/50 max-w-2xl w-full animate-in fade-in zoom-in-95 duration-300">
          <p className="text-emerald-400 font-bold">
            Bienvenue chez {user.guildName} !
          </p>
          <p className="text-xs text-slate-500 mt-1 italic">L'interface de gestion de guilde arrive bientôt.</p>
        </div>
      )}

      <footer className="mt-20 text-[10px] text-slate-700 font-mono uppercase tracking-widest">
        {t('welcome.footer')}
      </footer>

      <AuthModal 
        visible={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onLoginSuccess={checkLoginStatus}
      />

      <JoinGuildModal 
        visible={joinModalOpen} 
        onClose={() => {
          setJoinModalOpen(false);
        }}
        onJoined={() => {
          checkLoginStatus();
          setFlash(t('flash.request_sent'));
        }}
      />

      <CreateGuildModal 
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          checkLoginStatus();
          setFlash(t('flash.guild_created'));
        }}
      />
    </div>
  );
}