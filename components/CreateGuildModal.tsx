'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import GuildService from '@/lib/guildService';

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGuildModal({ isOpen, onClose, onSuccess }: CreateGuildModalProps) {
  const { t } = useLanguage();
  const [guildName, setGuildName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!guildName.trim()) return;
    setLoading(true);
    try {
      await GuildService.createGuild(guildName);

      // Mise à jour du localStorage avec les informations de la guilde créée
      const userData = localStorage.getItem('farmcore_user');
      if (userData) {
        const user = JSON.parse(userData);
        user.guildName = guildName;
        user.guildRank = 'leader'; // Le créateur est défini comme leader
        localStorage.setItem('farmcore_user', JSON.stringify(user));
      }

      setGuildName('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create guild:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">{t('guild_modal.create_title')}</h2>
            
            <input
              type="text"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              placeholder={t('guild_modal.guild_name_placeholder')}
              className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg mb-6 focus:outline-none focus:border-blue-500"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !guildName.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                {loading ? '...' : t('guild_modal.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}