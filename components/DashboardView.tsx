import { useLanguage } from '@/context/LanguageContext';
import { ResourceTotals, AllGains } from '@/types';
import { calculateMaxLevel } from '@/services/calculateLinks'; 
import { useState } from 'react';

const multipliers = {
  unit: 1,
  k: 1_000,
  m: 1_000_000,
  b: 1_000_000_000
};

type UnitKey = keyof typeof multipliers;

const IntegratedInput = ({ 
  value, 
  onChange, 
  onBlur,
  placeholder, 
  large = false,
  unit,
  onUnitChange
}: { 
  value: number, 
  onChange: (val: number) => void, 
  onBlur: () => void,
  placeholder?: string,
  large?: boolean,
  unit: UnitKey,
  onUnitChange: (u: UnitKey) => void
}) => {
  const displayVal = value === 0 ? '' : Math.round((value / multipliers[unit]) * 1000) / 1000;

  return (
    <div className={`relative flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-all ${large ? 'h-16' : 'h-11'}`}>
      <input 
        type="number"
        value={displayVal}
        placeholder={placeholder}
        onChange={(e) => {
          const val = e.target.value === '' ? 0 : Number(e.target.value);
          onChange(val * multipliers[unit]);
        }}
        onBlur={onBlur}
        className={`w-full bg-transparent outline-none px-4 font-bold text-white ${large ? 'text-2xl text-center' : 'text-sm'}`}
      />
      <div className="pr-2 bg-slate-950 flex items-center">
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as UnitKey)}
          className="bg-slate-800 text-[10px] font-black text-indigo-400 px-2 py-1 rounded border border-slate-700 outline-none cursor-pointer hover:bg-slate-700 transition-colors appearance-none"
        >
          <option value="unit">--</option>
          <option value="k">K</option>
          <option value="m">M</option>
          <option value="b">B</option>
        </select>
      </div>
    </div>
  );
};

interface Props {
  needs: ResourceTotals;
  already: ResourceTotals;
  gains: AllGains;
  startLevel: number;
  onAlreadyChange: (res: keyof ResourceTotals, val: number) => void;
  onNeedChange: (res: keyof ResourceTotals, val: number) => void;
  onGainChange: (res: keyof AllGains, field: 'val' | 'unit', val: number) => void;
}

export default function DashboardView({ 
  needs, already, gains, startLevel,
  onAlreadyChange, onNeedChange, onGainChange 
}: Props) {
  const { t } = useLanguage();
  const resources: (keyof ResourceTotals)[] = ['xp', 'shinzu', 'gold'];
  const [units, setUnits] = useState<Record<string, UnitKey>>({});

  // Sauvegarde explicite
  const handleSave = () => {
    localStorage.setItem('calculette_needs', JSON.stringify(needs));
    localStorage.setItem('calculette_already', JSON.stringify(already));
    localStorage.setItem('calculette_gains', JSON.stringify(gains));
  };

  const updateUnit = (id: string, u: UnitKey) => {
    setUnits(prev => ({ ...prev, [id]: u }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {resources.map((res) => {
        const valNeed = needs[res] || 0;
        const valAlready = already[res] || 0;
        const valGain = gains[res].val || 0;

        const remaining = Math.max(0, valNeed - valAlready);
        const gainPerHour = valGain / (gains[res].unit || 1);
        const totalHours = Math.floor(gainPerHour > 0 ? remaining / gainPerHour : 0);
        
        const maxReach = calculateMaxLevel(res, startLevel, valAlready);

        return (
          <div key={res} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-tighter">{res}</h3>
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
                <span className="text-[10px] text-indigo-300 font-bold uppercase">
                  {t('dashboard_view.max_level').replace('{{maxLevel}}', maxReach.toString())}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-y border-slate-800/50 py-4">
              <label className="block text-[10px] font-bold text-slate-600 uppercase text-center italic">
                {t('dashboard_view.total_needed')}
              </label>
              <IntegratedInput 
                value={valNeed}
                unit={units[`${res}_need`] || 'unit'}
                onUnitChange={(u) => updateUnit(`${res}_need`, u)}
                onChange={(val) => onNeedChange(res, val)}
                onBlur={handleSave}
                large
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase italic px-1">{t('dashboard_view.current_stock')}</label>
                <IntegratedInput 
                  value={valAlready}
                  unit={units[`${res}_already`] || 'unit'}
                  onUnitChange={(u) => updateUnit(`${res}_already`, u)}
                  onChange={(val) => onAlreadyChange(res, val)}
                  onBlur={handleSave}
                />
              </div>

              {/* ESTIMATION TEMPS */}
              <div className="text-[11px] font-bold text-center bg-slate-950/60 py-3 rounded-xl border border-slate-800/50">
                <span className="text-white text-sm">{totalHours.toLocaleString()} {t('dashboard_view.hours')}</span>
                <div className="text-[9px] text-slate-500 uppercase mt-1">Temps restant estimé</div>
              </div>

              {/* GAINS */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase italic px-1">{t('dashboard_view.gain')}</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <IntegratedInput 
                      value={valGain}
                      unit={units[`${res}_gain`] || 'unit'}
                      onUnitChange={(u) => updateUnit(`${res}_gain`, u)}
                      onChange={(val) => onGainChange(res as keyof AllGains, 'val', val)}
                      onBlur={handleSave}
                    />
                  </div>
                  <select 
                    value={gains[res].unit}
                    onChange={(e) => {
                      onGainChange(res as keyof AllGains, 'unit', parseInt(e.target.value) as 1 | 24);
                      setTimeout(handleSave, 50); // Petit délai pour laisser l'état se propager
                    }}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-xl px-2 text-[10px] font-black uppercase text-slate-300 outline-none cursor-pointer"
                  >
                    <option value={1}>/H</option>
                    <option value={24}>/24H</option>
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