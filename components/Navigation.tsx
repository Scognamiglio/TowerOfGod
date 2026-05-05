import { useLanguage } from '@/context/LanguageContext';

interface Props {
  activeTab: 'links' | 'dash';
  setActiveTab: (tab: 'links' | 'dash') => void;
}

export default function Navigation({ activeTab, setActiveTab }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex justify-between items-center border-b border-slate-800 pb-6">
      <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-800 shadow-inner">
        {(['links', 'dash'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'links' ? t('navigation.links') : t('navigation.dashboard')}
          </button>
        ))}
      </div>
    </div>
  );
}