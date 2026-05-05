import { useLanguage } from '@/context/LanguageContext';

interface LinkRowProps {
  index: number;
  start: number;
  end: number;
  onUpdate: (index: number, field: 'start' | 'end', value: number) => void;
  onBlur: () => void;
}

export default function LinkRow({ index, start, end, onUpdate, onBlur }: LinkRowProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
      <span className="text-xs font-bold text-indigo-400 w-16">
        {t('link_row.link_label').replace('{{index}}', (index + 1).toString())}
      </span>
      <input 
        type="number" 
        value={start}
        onChange={(e) => onUpdate(index, 'start', parseInt(e.target.value) || 0)}
        onBlur={onBlur}
        className="w-full bg-slate-950 p-2 rounded border border-slate-700 outline-none focus:border-indigo-500"
      />
      <span className="text-slate-600">➜</span>
      <input 
        type="number" 
        value={end}
        onChange={(e) => onUpdate(index, 'end', parseInt(e.target.value) || 0)}
        onBlur={onBlur}
        className="w-full bg-slate-950 p-2 rounded border border-slate-700 outline-none focus:border-indigo-500"
      />
    </div>
  );
}