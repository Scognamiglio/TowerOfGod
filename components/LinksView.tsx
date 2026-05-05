import { useLanguage } from '@/context/LanguageContext';
import LinkRow from './LinkRow';

interface Props {
  links: { start: number; end: number }[];
  onUpdate: (index: number, field: 'start' | 'end', value: number) => void;
  onCalculate: () => void;
  onSkip: () => void;
  onBlur: () => void;
}

export default function LinksView({ links, onUpdate, onCalculate, onSkip, onBlur }: Props) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
      <div className="grid gap-3">
        {links.map((link, i) => (
          <LinkRow key={i} index={i} start={link.start} end={link.end} onUpdate={onUpdate} onBlur={onBlur} />
        ))}
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onCalculate} 
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl font-black uppercase transition-all"
        >
          {t('links_view.calculate_dashboard')}
        </button>
        <button 
          onClick={onSkip} 
          className="px-6 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-xs uppercase text-slate-400"
        >
          {t('links_view.skip')}
        </button>
      </div>
    </div>
  );
}