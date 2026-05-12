import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function HelperModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all font-bold text-sm mb-4"
        title={t('helper_modal.button_title')}
      >
        <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs">?</span>
        {t('helper_modal.button_text')}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400">ℹ️</span> {t('helper_modal.modal_title')}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 text-slate-300 text-sm">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-emerald-400 border-b border-emerald-900/50 pb-2">📌 {t('helper_modal.general_instructions')}</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>{t('helper_modal.go_to')} <span className="text-white font-semibold">{t('helper_modal.shinzu_link')}</span></li>
                  <li>{t('helper_modal.use_amplification')}</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-amber-400 border-b border-amber-900/50 pb-2">📈 {t('helper_modal.for_gain')}</h4>
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-3 shadow-inner">
                  <img src="https://pub-2b8cd5a619e14961a5620b487413ab81.r2.dev/image/3d044225-1c5a-4271-ba38-e9dd8271d50f.jpg" alt={t('helper_modal.img_alt_gain')} className="w-2/3 max-w-[300px] mx-auto rounded-lg shadow-sm" />
                </div>
                <p className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-amber-500 font-bold text-lg">👉</span>
                  <span>{t('helper_modal.select')} <span className="px-2 py-0.5 bg-slate-950 rounded text-amber-300 font-bold border border-slate-700">{t('helper_modal.one_time_24h')}</span> {t('helper_modal.for_each_resource')}</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-sky-400 border-b border-sky-900/50 pb-2">📦 {t('helper_modal.for_stock')}</h4>
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-3 shadow-inner">
                  <img src="https://pub-2b8cd5a619e14961a5620b487413ab81.r2.dev/image/5a08926c-be41-4ff0-b8ec-05b4bfbda99e.jpg" alt={t('helper_modal.img_alt_stock')} className="w-2/3 max-w-[300px] mx-auto rounded-lg shadow-sm" />
                </div>
                <p className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-sky-500 font-bold text-lg">👉</span>
                  <span>{t('helper_modal.select')} <span className="px-2 py-0.5 bg-slate-950 rounded text-sky-300 font-bold border border-slate-700">{t('helper_modal.all_plus')}</span> {t('helper_modal.for_each_resource')}</span>
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-center flex items-center justify-center gap-2">
                <span className="text-xl">⚠️</span> {t('helper_modal.no_commas_warning')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
