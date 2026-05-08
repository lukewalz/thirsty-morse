/** Render a score field that may arrive as string, number, null, undefined,
 *  or empty string. Used everywhere we display a team score. */
export function formatScore(s: string | number | null | undefined): string {
  if (s == null || s === "") return "—";
  const n = parseInt(String(s), 10);
  return Number.isFinite(n) ? String(n) : "—";
}
