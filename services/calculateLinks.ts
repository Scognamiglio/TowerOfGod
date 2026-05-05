import { ResourceTotals } from '@/types';
import { SHINZU_COSTS } from '@/data/shinzuCosts';
import { XP_COSTS } from '@/data/xpCosts';
import { GOLD_COSTS } from '@/data/goldCosts';

const DATA_MAP: Record<keyof ResourceTotals, Record<number, number>> = {
    shinzu: SHINZU_COSTS,
    xp: XP_COSTS,
    gold: GOLD_COSTS
};

const calculateResource = (
    links: { start: number; end: number }[], 
    data: Record<number, number>
): number => {
    let total = 0;

    links.forEach(link => {
        for (let L = link.start; L < link.end; L++) {
            total += data[L] || 0;
        }
    });

    return total;
};

export const calculateLinks = (links: { start: number; end: number }[]): ResourceTotals => {
    const totalShinzu = calculateResource(links, SHINZU_COSTS);
    const totalXP = calculateResource(links, XP_COSTS);
    const totalGold = calculateResource(links, GOLD_COSTS);

    return {
        xp: totalXP,
        shinzu: totalShinzu,
        gold: totalGold
    };
};

export const calculateMaxLevel = (
    resType: keyof ResourceTotals,
    startLevel: number,
    currentStock: number
): number => {
    const data = DATA_MAP[resType];
    let stock = currentStock;
    let maxLevel = startLevel;

    while (data[maxLevel] !== undefined && stock >= data[maxLevel]) {
        stock -= data[maxLevel];
        maxLevel++;
    }

    return maxLevel;
};