// Load and expose the search configuration embedded in the page or on window.

/*
 * loadConfig()
 * Read `window.searchConfig` or parse the JSON embedded in
 * `<script id="search-config" type="application/json">`.
 */
export function loadConfig() {
  let CONFIG = window.searchConfig || null;
  const configEl = document.getElementById('search-config');
  if ((!CONFIG || Object.keys(CONFIG).length === 0) && configEl) {
    try {
      CONFIG = JSON.parse(configEl.textContent || '{}');
      window.searchConfig = CONFIG;
    } catch (e) {
      CONFIG = {};
    }
  }
  return CONFIG || {};
}
