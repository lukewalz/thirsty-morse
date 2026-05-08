/** Default per-leg odds for spread / total in our app. -110 american
 *  → 1.909 decimal. Real sportsbooks vary by line and book; we treat
 *  every leg as -110 for parlay math. */
export const PER_LEG_DECIMAL = 1.909;

export function combinedDecimal(legCount: number): number {
  return PER_LEG_DECIMAL ** legCount;
}

export function decimalToAmerican(decimal: number): string {
  if (decimal <= 1) return "0";
  if (decimal >= 2) {
    const am = Math.round((decimal - 1) * 100);
    return `+${am}`;
  }
  const am = Math.round(-100 / (decimal - 1));
  return String(am);
}

export function projectedPayout(stake: number, legCount: number): number {
  if (stake <= 0 || legCount === 0) return 0;
  return Math.round(stake * combinedDecimal(legCount) * 100) / 100;
}

export function projectedProfit(stake: number, legCount: number): number {
  return Math.round((projectedPayout(stake, legCount) - stake) * 100) / 100;
}
