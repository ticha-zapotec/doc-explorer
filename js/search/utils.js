// Utilities used by the search system

/*
 * pruneDiacritics(string)
 * Remove diacritics and common punctuation from a string for normalized searching.
 */
export function pruneDiacritics(string) {
    let str = String(string);
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('.', '').replaceAll(',', '').replaceAll('(', '').replaceAll(')', '');
  }

/*
 * toQueryString(tokens)
 * Convert token array into a boosted Lunr query string.
 */
export function toQueryString(tokens) {
  return tokens.map((token) => `${token}^100 +${token}*^10 ${token}~2`).join(' ');
}

/*
 * truncateString(string)
 * Truncate a string to a reasonable display length.
 */
export function truncateString(string){
  let str = String(string || '');
  let max = 60;
  if (str.length < max) return str;
  return str.substring(0, max) + "...";
}
