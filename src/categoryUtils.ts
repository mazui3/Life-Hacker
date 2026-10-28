// Article categories come from articles.json as an array of capitalized names
// (e.g. ["Career", "Lifestyle"]), while nav ids and PlayFab stat keys are
// lowercase slugs. These helpers bridge the two.

/** Lowercase, trimmed slugs for an article's categories. */
export const categorySlugs = (category: string[]): string[] =>
  category.map((c) => c.toLowerCase().trim());

/** True if the article carries the given category (case-insensitive). */
export const hasCategory = (category: string[], target: string): boolean =>
  categorySlugs(category).includes(target.toLowerCase().trim());

/** True if the two articles share at least one category. */
export const sharesCategory = (a: string[], b: string[]): boolean => {
  const slugs = categorySlugs(b);
  return categorySlugs(a).some((slug) => slugs.includes(slug));
};

/** The category used for badges and single-label display. */
export const primaryCategory = (category: string[]): string => category[0] ?? "";
