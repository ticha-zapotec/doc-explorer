import { loadConfig } from './search/config.js';
import { buildIndex } from './search/indexer.js';
import { initUI } from './search/ui.js';
import { pruneDiacritics } from './search/utils.js';

window.addEventListener("load", (event) => {
  var resultsContainer  = document.getElementById('results');
  var resultsInfo       = document.getElementById('results-info');
  var activeFacetsContainer = document.getElementById('active-facets');
  var searchInput       = document.getElementById("search-input");
  var searchLimitSelect = document.getElementById("search-limit-select");
  var searchSubmit      = document.getElementById("search-submit");
  var urlParams         = new URLSearchParams(window.location.search);
});

window.addEventListener('load', async () => {
  const CONFIG = loadConfig();
  const data = await window.promisedData;
  const { idx, resultsLookupMap } = buildIndex(data, CONFIG);

  // Initialize UI and wire handlers
  initUI({ idx, resultsLookupMap });
});
// This file is now a thin ES module loader; functionality has been moved to
// `src/js/search/*.js` modules for clarity and maintainability.
