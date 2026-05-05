// components/LanguageSelector.tsx
'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const langs = [
    { code: 'fr', label: 'FRA', flag: '🇫🇷' },
    { code: 'en', label: 'ENG', flag: '🇬🇧' },
    { code: 'de', label: 'DEU', flag: '🇩🇪' }
  ];

  return (
    <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
            language === l.code 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}