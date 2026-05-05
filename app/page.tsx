'use client';
import { useState, useEffect } from 'react';
import { calculateLinks } from '@/services/calculateLinks';
import { ResourceTotals, AllGains } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

import Navigation from '@/components/Navigation';
import LinksView from '@/components/LinksView';
import DashboardView from '@/components/DashboardView';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useLocalStorage } from '@/helpers/useLocalStorage';

function MainAppContent() {
  const { t } = useLanguage();
  const [view, setView] = useState<'home' | 'app'>('home');
  const [activeTab, setActiveTab] = useState<'links' | 'dash'>('links');

  const [links, setLinks] = useLocalStorage('calculette_links', Array(5).fill({ start: 1600, end: 1700 }));
  const [needs, setNeeds] = useLocalStorage<ResourceTotals>('calculette_needs', { xp: 0, shinzu: 0, gold: 0 });
  const [already, setAlready] = useLocalStorage<ResourceTotals>('calculette_already', { xp: 0, shinzu: 0, gold: 0 });
  const [gains, setGains] = useLocalStorage<AllGains>('calculette_gains', {
    xp: { val: 52894000, unit: 1 },
    shinzu: { val: 448, unit: 1 },
    gold: { val: 120000, unit: 1 }
  });

  const calculateAndGo = async () => {
    const data = await calculateLinks(links);
    setNeeds(data);
    localStorage.setItem('calculette_needs', JSON.stringify(data));
    setActiveTab('dash');
  };

  if (view === 'home') {
    return <WelcomeScreen onEnter={() => { setView('app'); setActiveTab('links'); }} />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <header className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-4xl font-black italic tracking-tighter">
              FARM<span className="text-indigo-500">CORE</span>
            </h1>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex items-center">
            <button 
              onClick={() => setView('home')} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-400 transition-all group"
            >
              <span className="flex items-center justify-center w-6 h-6 border border-slate-800 rounded group-hover:border-indigo-500/50">←</span>
              {t('app.back_home')}
            </button>
          </div>
        </header>

        <main>
          {activeTab === 'links' ? (
            <LinksView 
              links={links} 
              onUpdate={(i, f, v) => {
                  const u = [...links];
                  u[i] = { ...u[i], [f]: v };
                  setLinks(u);
              }} 
              onCalculate={calculateAndGo}
              onSkip={() => setActiveTab('dash')}
              onBlur={() => localStorage.setItem('calculette_links', JSON.stringify(links))}
            />
          ) : (
            <DashboardView 
              needs={needs} 
              already={already} 
              gains={gains}
              startLevel={links.length > 0 ? Math.min(...links.map(l => l.start || 0)) : 1} 
              onNeedChange={(res, val) => setNeeds({...needs, [res]: val})}
              onAlreadyChange={(res, val) => setAlready({...already, [res]: val})}
              onGainChange={(res, field, val) => setGains({
                ...gains, [res]: { ...gains[res], [field]: val }
              })}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-black" />;
  return <MainAppContent />;
}