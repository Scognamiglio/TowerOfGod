import { useLanguage } from '@/context/LanguageContext';
import { ResourceTotals, AllGains } from '@/types';
import { calculateMaxLevel } from '@/services/calculateLinks'; 

interface Props {
  needs: ResourceTotals;
  already: ResourceTotals;
  gains: AllGains;
  startLevel: number; // Nouvelle prop indispensable
  onAlreadyChange: (res: keyof ResourceTotals, val: number) => void;
  onNeedChange: (res: keyof ResourceTotals, val: number) => void;
  onGainChange: (res: keyof AllGains, field: 'val' | 'unit', val: number) => void;
}

export default function DashboardView({ 
  needs, 
  already, 
  gains,
  startLevel,
  onAlreadyChange, 
  onNeedChange, 
  onGainChange 
}: Props) {
  const { t } = useLanguage();
  const resources: (keyof ResourceTotals)[] = ['xp', 'shinzu', 'gold'];

  const handleSaveToLocal = () => {
    localStorage.setItem('calculette_needs', JSON.stringify(needs));
    localStorage.setItem('calculette_already', JSON.stringify(already));
    localStorage.setItem('calculette_gains', JSON.stringify(gains));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {resources.map((res) => {
        const valNeed = needs[res] || 0;
        const valAlready = already[res] || 0;
        const valGain = gains[res].val || 0;

        // CALCULS DE TEMPS
        const remaining = Math.max(0, valNeed - valAlready);
        const gainPerHour = valGain / (gains[res].unit || 1);
        const totalHours = gainPerHour > 0 ? remaining / gainPerHour : 0;
        const totalHoursInt = Math.floor(totalHours);
        const daysAsH24 = Math.floor(totalHoursInt / 24);
        const remainingH1 = totalHoursInt % 24;

        // LE CALCUL DU MAX ATTEIGNABLE (Utilise enfin le vrai startLevel)
        const maxReach = calculateMaxLevel(res, startLevel, valAlready);

        return (
          <div key={res} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-indigo-400">{res}</h3>
              {/* BADGE DYNAMIQUE */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md group relative">
                <span className="text-[10px] text-indigo-300 font-bold">
                  {t('dashboard_view.max_level').replace('{{maxLevel}}', maxReach.toString())}
                </span>
                {/* Petit tooltip discret pour debug */}
                <div className="absolute hidden group-hover:block -top-8 right-0 bg-black text-[8px] p-1 rounded">
                  {t('dashboard_view.start_level').replace('{{startLevel}}', startLevel.toString())}
                </div>
              </div>
            </div>

            {/* BESOIN TOTAL */}
            <div className="py-4 border-y border-slate-800/50">
                <label className="block text-[10px] font-bold text-slate-600 uppercase text-center mb-1">{t('dashboard_view.total_needed')}</label>
                <input 
                  type="number" 
                  value={needs[res] === 0 ? '' : needs[res]} 
                  onChange={(e) => onNeedChange(res, e.target.value === '' ? 0 : parseInt(e.target.value))}
                  onBlur={handleSaveToLocal}
                  placeholder={t('dashboard_view.input_placeholder')}
                  className="w-full bg-transparent text-2xl font-black text-white text-center outline-none focus:text-indigo-400 transition"
                />
                <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest text-center">
                  {t('dashboard_view.hours_format').replace('{{hours}}', totalHoursInt.toLocaleString())}
                </div>
            </div>

            <div className="space-y-4">
              {/* STOCK ACTUEL */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase italic">{t('dashboard_view.current_stock')}</label>
                <input 
                  type="number" 
                  value={already[res] === 0 ? '' : already[res]}
                  onChange={(e) => onAlreadyChange(res, e.target.value === '' ? 0 : parseInt(e.target.value))}
                  onBlur={handleSaveToLocal}
                  placeholder={t('dashboard_view.input_placeholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* FORMAT HEURES */}
              <div className="text-[11px] font-bold text-center bg-slate-950/60 py-3 rounded-xl border border-slate-800/50 tracking-tight shadow-inner">
                <span className="text-white text-sm">{totalHoursInt.toLocaleString()}{t('dashboard_view.hours')}</span>
                <span className="ml-2 text-slate-600">
                  (<span className="text-slate-400">{daysAsH24}</span><span className="text-indigo-500/80 font-black">{t('dashboard_view.days_hours')}</span>
                  <span className="mx-1 text-slate-700">{t('dashboard_view.add')}</span>
                  <span className="text-slate-400">{remainingH1}</span><span className="text-emerald-500/80 font-black">h1</span>)
                </span>
              </div>

              {/* GAINS */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase italic">{t('dashboard_view.gain')}</label>
                  <input 
                    type="number" 
                    value={gains[res].val === 0 ? '' : gains[res].val}
                    onChange={(e) => onGainChange(res as keyof AllGains, 'val', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    onBlur={handleSaveToLocal}
                    placeholder={t('dashboard_view.input_placeholder')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div className="w-20">
                  <label className="text-[10px] font-bold text-slate-500 uppercase italic">{t('dashboard_view.unit')}</label>
                  <select 
                    value={gains[res].unit}
                    onChange={(e) => onGainChange(res as keyof AllGains, 'unit', parseInt(e.target.value) as 1 | 24)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs outline-none cursor-pointer"
                  >
                    <option value={1}>{t('dashboard_view.per_hour')}</option>
                    <option value={24}>{t('dashboard_view.per_24_hours')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}