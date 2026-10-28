// The in-game date arrives in several shapes: PlayFab `player_state.date` is a
// YYYYMMDD integer (20250401), the legacy `game_time` keys are strings
// ("2025-04-01"), and articles.json carries "2025-01-01 12:00:00 AM".
// Reduce all of them to a comparable YYYYMMDD integer so date comparisons never
// depend on how the JS Date parser treats a given format or timezone.
export const toDateNum = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") return null;

  const str = String(value).trim();

  // "2025-04-01", "2025/4/1 12:00:00 AM"
  const parts = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (parts) {
    return Number(parts[1]) * 10000 + Number(parts[2]) * 100 + Number(parts[3]);
  }

  // "20250401"
  const digits = str.replace(/[^0-9]/g, "");
  if (digits.length >= 8) return Number(digits.substring(0, 8));

  return null;
};
