'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import GuildService from '@/lib/guildService';

interface Guild {
  _id: string;
  name: string;
  leader: {
    _id: string;
    pseudo: string;
  };
}

interface JoinGuildModalProps {
  visible: boolean;
  onClose: () => void;
  onJoined: () => void;
}

export default function JoinGuildModal({ visible, onClose, onJoined }: JoinGuildModalProps) {
  const { t } = useLanguage();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const limit = 5;

  const fetchGuilds = useCallback(async () => {
    setLoading(true);
    try {
      const response = search 
        ? await GuildService.searchGuilds(search, page, limit)
        : await GuildService.getGuilds(page, limit);
      
      setGuilds(response.data.data);
      setLastPage(response.data.lastPage);
    } catch (err) {
      console.error("Error fetching guilds:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    if (!visible) return;
    const handler = setTimeout(fetchGuilds, 300);
    return () => clearTimeout(handler);
  }, [visible, fetchGuilds]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleJoin = async (id: string) => {
    try {
      await GuildService.joinGuild(id);
      onJoined();
      onClose();
    } catch (err) {
      alert("Erreur lors de l'adhésion");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors text-2xl">×</button>
        
        <h2 className="text-3xl font-black text-white mb-2">{t('guild_modal.title')}</h2>
        <p className="text-slate-500 text-sm mb-8 uppercase tracking-widest font-bold">Tower of God • Community</p>

        <div className="mb-8">
          <input 
            type="text"
            placeholder={t('guild_modal.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-4 min-h-[360px]">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-slate-500 uppercase text-xs font-black tracking-[0.3em] animate-pulse">Chargement...</div>
          ) : guilds.length > 0 ? (
            guilds.map(guild => (
              <div key={guild._id} className="group flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all">
                <div>
                  <div className="text-white text-lg font-black tracking-tight">{guild.name}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase mt-1">
                    {t('guild_modal.leader')}: <span className="text-indigo-400">{guild.leader.pseudo}</span>
                  </div>
                </div>
                <button 
                   className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                   onClick={() => handleJoin(guild._id)}
                >
                  {t('guild_modal.join')}
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-700 font-bold uppercase text-xs tracking-widest">
              {t('guild_modal.no_guilds')}
            </div>
          )}
        </div>

        {lastPage > 1 && (
          <div className="mt-8 flex items-center justify-center gap-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 text-slate-500 hover:text-indigo-400 disabled:opacity-10 transition-colors font-black">← PREV</button>
            <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800">{page} / {lastPage}</span>
            <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)} className="p-2 text-slate-500 hover:text-indigo-400 disabled:opacity-10 transition-colors font-black">NEXT →</button>
          </div>
        )}
      </div>
    </div>
  );
}