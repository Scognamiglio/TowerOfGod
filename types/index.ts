export interface ResourceTotals {
  xp: number;
  shinzu: number;
  gold: number;
}

export interface GainSettings {
  val: number;
  unit: 1 | 24;
}

export interface AllGains {
  xp: GainSettings;
  shinzu: GainSettings;
  gold: GainSettings;
}