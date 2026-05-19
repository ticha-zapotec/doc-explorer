import { pruneDiacritics, toQueryString } from './utils.js';
import { loadConfig } from './config.js';

/*
 * submitSearchQuery(idx, resultsLookupMap, state)
 * Run a search against `idx` using the current `state` (search input, selected field,
 * selected facets/ranges) and return the raw Lunr results array.
 */
export function submitSearchQuery(idx, resultsLookupMap, state) {
  const CONFIG = loadConfig();
  let query = '* *';
  if (state.searchInput && state.searchInput.value) {
    const input = pruneDiacritics(state.searchInput.value);
    const tokens = input.split(' ').filter(Boolean);

    if (state.selectedSearchField && state.selectedSearchField !== (CONFIG.defaultSearchField || 'All Fields')) {
      const lunrFieldName = (CONFIG.lunrFieldMap && CONFIG.lunrFieldMap[state.selectedSearchField]) || state.selectedSearchField;
      query = tokens.map((token) => `${lunrFieldName}:${token}^100 +${lunrFieldName}:${token}*^10 ${lunrFieldName}:${token}~2`).join(' ');
    } else {
      query = toQueryString(tokens);
    }
  }

  let results = idx.search(query) || [];

  const facetDefinitions = CONFIG.facets || [];
  const activeFacets = Object.entries(state.selectedFacets).filter(([_, values]) => values.length > 0);
  const activeRanges = Object.entries(state.selectedRanges).filter(([_key, range]) => range.min !== '' || range.max !== '');

  const truthyField = (value) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0' || value == null) return false;
    if (Array.isArray(value)) return value.length > 0;
    return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
  };

  if (activeFacets.length > 0 || activeRanges.length > 0) {
    results = results.filter((res) => {
      const item = resultsLookupMap[res.ref];

      const facetMatch = activeFacets.every(([facetKey, selectedValues]) => {
        const facetDef = facetDefinitions.find((facet) => facet.key === facetKey);
        if (facetDef?.type === 'booleanlist') {
          return selectedValues.every((selected) => truthyField(item[selected]));
        }

        const propMap = CONFIG.facetKeyToProperty || {};
        const propName = propMap[facetKey] || facetKey.toLowerCase().replaceAll(' ', '_');
        const itemValue = pruneDiacritics(item[propName] || '');
        if (!itemValue) return false;

        if (propName === 'year') {
          return selectedValues.some(selected => {
            if (selected.includes('*')) {
              const pattern = selected.replaceAll('*', '\\d');
              return new RegExp(`^${pattern}$`).test(itemValue);
            }
            return selected === itemValue;
          });
        }

        return selectedValues.some(selected => selected === itemValue);
      });

      const rangeMatch = activeRanges.every(([facetKey, range]) => {
        const propMap = CONFIG.facetKeyToProperty || {};
        const propName = propMap[facetKey] || facetKey.toLowerCase().replaceAll(' ', '_');
        if (propName !== 'year') return true;

        const itemYear = Number(item[propName]);
        if (Number.isNaN(itemYear)) return false;

        const min = range.min !== '' ? Number(range.min) : -Infinity;
        const max = range.max !== '' ? Number(range.max) : Infinity;
        return itemYear >= min && itemYear <= max;
      });

      return facetMatch && rangeMatch;
    });
  }

  return results;
}

/*
 * initUI({idx, resultsLookupMap})
 * Wire up DOM elements, event handlers, and state. Returns an object with
 * methods to interact with the UI if needed.
 */
export async function initUI({ idx, resultsLookupMap, documents }) {
  const CONFIG = loadConfig();
  const resultsContainer  = document.getElementById('results');
  const resultsInfo       = document.getElementById('results-info');
  const activeFacetsContainer = document.getElementById('active-facets');
  const searchInput       = document.getElementById('search-input');
  const searchLimitSelect = document.getElementById('search-limit-select');
  const searchSubmit      = document.getElementById('search-submit');
  const facetPanels       = document.getElementById('facet-panels');
  const apiBase           = `${window.prefixUrl}api/`;

  const state = {
    selectedFacets: {},
    selectedRanges: {},
    selectedSearchField: CONFIG.defaultSearchField || 'All Fields',
    searchInput
  };

  const isNonEmpty = (value) => value !== undefined && value !== null && String(value).trim() !== '';
  const sortStrings = (a, b) => String(a).localeCompare(String(b), undefined, { sensitivity: 'base', numeric: true });
  const uniqueOrdered = (values) => [...new Set(values.filter(isNonEmpty))].sort(sortStrings);

  const facetValues = {
    Language: uniqueOrdered(documents.map((doc) => doc.language)),
    'Document Type': [],
    Archive: []
  };

  const yearNumbers = documents
    .map((doc) => Number(doc.year))
    .filter((value) => !Number.isNaN(value));
  const yearRange = yearNumbers.length
    ? { min: Math.min(...yearNumbers), max: Math.max(...yearNumbers) }
    : { min: '', max: '' };

  async function loadApiFacetValues() {
    const [archives, documentTypes] = await Promise.all([
      fetch(`${apiBase}archives.json`).then((res) => res.ok ? res.json() : []).catch(() => []),
      fetch(`${apiBase}document_types.json`).then((res) => res.ok ? res.json() : []).catch(() => [])
    ]);

    facetValues.Archive = uniqueOrdered(archives);
    facetValues['Document Type'] = uniqueOrdered(documentTypes);
  }

  function createCheckboxOption(facetKey, value) {
    const listItem = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'flex items-center cursor-pointer rounded px-2 py-1 transition-colors';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.facet = facetKey;
    input.dataset.value = value;
    input.className = 'w-4 h-4 rounded accent-accent-alt-dark border-text-light text-accent-light focus:ring-text-light focus:ring cursor-pointer';

    const text = document.createElement('span');
    text.className = 'ml-2 text-text-dark hover:text-accent-light';
    text.textContent = value;

    label.appendChild(input);
    label.appendChild(text);
    listItem.appendChild(label);
    return listItem;
  }

  function createRangeInputs(facetKey, min, max) {
    const wrapper = document.createElement('div');
    wrapper.className = 'pl-2 flex flex-row w-full gap-2 items-center justify-start';

    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.dataset.facet = facetKey;
    minInput.dataset.range = 'min';
    minInput.placeholder = min;
    minInput.min = min;
    minInput.max = max;
    minInput.className = 'border rounded-md px-2 focus-visible:ring focus-visible:ring-text-light max-w-24';

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.dataset.facet = facetKey;
    maxInput.dataset.range = 'max';
    maxInput.placeholder = max;
    maxInput.min = min;
    maxInput.max = max;
    maxInput.className = 'border rounded-md px-2 focus:ring focus:ring-text-light max-w-24';

    const separator = document.createElement('span');
    separator.className = 'text-center';
    separator.textContent = '—';

    wrapper.append(minInput, separator, maxInput);
    return wrapper;
  }

  function renderFacetPanels() {
    if (!facetPanels) return;
    facetPanels.innerHTML = '';

    (CONFIG.facets || []).forEach((facet) => {
      const listItem = document.createElement('li');
      listItem.className = 'p-4 bg-[#f8f4ea] shadow rounded-md tracking-tight mb-6';

      const heading = document.createElement('div');
      heading.className = `text-xl font-bold my-3 px-2 ${facet.wip ? 'text-accent-light' : ''}`;
      heading.textContent = facet.key;
      listItem.appendChild(heading);

      if (facet.type === 'multiselect') {
        const values = facetValues[facet.key] || [];
        const valuesList = document.createElement('ul');
        values.forEach((value) => valuesList.appendChild(createCheckboxOption(facet.key, value)));
        listItem.appendChild(valuesList);
      }

      if (facet.type === 'booleanlist') {
        const valuesList = document.createElement('ul');
        facet.list.forEach((value) => {
          valuesList.appendChild(createCheckboxOption(facet.key, value.key));
          valuesList.lastChild.querySelector('span').textContent = value.label;
        });
        listItem.appendChild(valuesList);
      }

      if (facet.type === 'numrange') {
        listItem.appendChild(createRangeInputs(facet.key, yearRange.min, yearRange.max));
      }

      facetPanels.appendChild(listItem);
    });
  }

  function appendSearchResults(results) {
    resultsContainer.innerHTML = null;
    results.forEach(function (res) {
      let item = resultsLookupMap[res.ref];
      let resultDiv = document.createElement('div');
      let hexColor = `${item.color}`;
      resultDiv.classList.add('w-full', 'group', 'transition', 'duration-350', 'ease-in-out', 'hover:scale-110');
      resultDiv.innerHTML = `
        <a href="${prefixUrl}document/${ item.slug }.html">          
          <div class="relative h-36 w-full rounded-tl-[3rem] rounded-br-[3rem] overflow-hidden bg-[url(../static/Tl675b.png)] bg-contain bg-center">
            ${ item.language && item.language.startsWith('Zapotec') ? 
              `<div class="absolute top-0 right-0 bg-red-950 text-[#f7efdc] text-lg font-bold px-2 py-1 rounded-bl-lg z-10">Zapotec</div>` 
            : 
            `<div class="absolute top-0 right-0 bg-accent-dark text-[#f7efdc] text-lg font-bold px-2 py-1 rounded-bl-lg z-10">Spanish</div>` 
            }
            ${ item.digital_edition ? `<div class="absolute bottom-0 left-0 bg-[url(../static/flower.png)] bg-cover bg-center h-10 w-10 px-2 py-1 rounded-tr-lg z-10"></div>` : '' }
            <div class="absolute top-0 left-0 w-full h-full block transition-opacity saturate-50 opacity-80 duration-350 ease-in-out group-hover:opacity-0" style="background-color: #${hexColor};"></div>
          </div>
          <div class="mt-4">
          ${ item.title.startsWith('Translation') ?
            `<h2 class="text-text-dark title-font text-lg font-bold leading-tight"><span class="underline group-hover:text-accent-light">${item.title.split(' ')[0]}</span> ${item.title.split(' ').slice(1).join(' ')}</h2>`
            :
            item.digital_edition ?
            `<h2 class="text-text-dark title-font text-lg font-bold leading-tight"><span class="underline group-hover:text-accent-light">Digital Edition</span> ${item.title}</h2>`
            :
            `<h2 class="text-text-dark title-font text-lg font-bold leading-tight">${item.title}</h2>`
          }
          </div>
        </a>`;
      resultsContainer.appendChild(resultDiv);
    });
  }

  function appendSearchInfo(resultsLength, fullIndexLength) {
    resultsInfo.innerHTML = null;
    let infoDiv = document.createElement('div');
    infoDiv.innerHTML = `Showing ${resultsLength} of ${fullIndexLength} results`;
    resultsInfo.appendChild(infoDiv);
  }

  function renderActiveFacets() {
    activeFacetsContainer.innerHTML = null;

    if (searchInput && searchInput.value) {
      const queryTag = document.createElement('div');
      queryTag.className = 'inline-flex items-center gap-2 bg-accent-alt-light text-accent-alt-dark px-3 py-1 rounded-full text-xs';
      queryTag.innerHTML = `
      <button class="hover:text-accent-light cursor-pointer" data-query-tag="true">
        <span class="font-mono"><b>Search (${state.selectedSearchField}):</b> ${searchInput.value}</span>
        <span class="ml-1 font-bold"> × </span>
      </button>
      `;

      const removeQueryBtn = queryTag.querySelector('button');
      removeQueryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchInput.value = '';
        handleSearchBehavior();
      });

      activeFacetsContainer.appendChild(queryTag);
    }

    const getFacetLabel = (facetKey, valueKey) => {
      const facetDef = (CONFIG.facets || []).find((facet) => facet.key === facetKey);
      if (!facetDef || facetDef.type !== 'booleanlist') return valueKey;
      const listItem = facetDef.list.find((item) => item.key === valueKey);
      return listItem?.label || valueKey;
    };

    Object.entries(state.selectedFacets).forEach(([facetKey, values]) => {
      values.forEach((value) => {
        const displayValue = getFacetLabel(facetKey, value);
        const tag = document.createElement('div');
        tag.className = 'inline-flex items-center gap-2 bg-accent-alt-light text-accent-alt-dark px-3 py-1 rounded-full text-xs hover:shadow ';
        tag.innerHTML = `
        <button class="hover:text-accent-light cursor-pointer" data-facet="${facetKey}" data-value="${value}">
          <span class="font-mono"><b>${facetKey}:</b> ${displayValue}</span>
          <span class="ml-1 font-bold"> × </span>
        </button>
        `;

        const removeBtn = tag.querySelector('button');
        removeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const facetKeyToRemove = this.getAttribute('data-facet');
          const valueToRemove = this.getAttribute('data-value');

          state.selectedFacets[facetKeyToRemove] = state.selectedFacets[facetKeyToRemove].filter(v => v !== valueToRemove);

          const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-facet="${facetKeyToRemove}"][data-value]`);
          checkboxes.forEach((checkbox) => {
            if (pruneDiacritics(checkbox.getAttribute('data-value')) === valueToRemove) {
              checkbox.checked = false;
            }
          });

          handleSearchBehavior();
        });

        activeFacetsContainer.appendChild(tag);
      });
    });

    Object.entries(state.selectedRanges).forEach(([facetKey, range]) => {
      if (!range.min && !range.max) return;

      const rangeValue = range.min && range.max ? `${range.min}–${range.max}` : range.min ? `≥${range.min}` : `≤${range.max}` ;
      const tag = document.createElement('div');
      tag.className = 'inline-flex items-center gap-2 bg-accent-alt-light text-accent-alt-dark px-3 py-1 rounded-full text-xs hover:shadow ';
      tag.innerHTML = `
        <button class="hover:text-accent-light cursor-pointer" data-range-facet="${facetKey}">
          <span class="font-mono"><b>${facetKey}:</b> ${rangeValue}</span>
          <span class="ml-1 font-bold"> × </span>
        </button>
      `;

      const removeBtn = tag.querySelector('button');
      removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const facetKeyToRemove = this.getAttribute('data-range-facet');
        state.selectedRanges[facetKeyToRemove] = {min: '', max: ''};

        const rangeInputs = document.querySelectorAll(`input[data-facet="${facetKeyToRemove}"][data-range]`);
        rangeInputs.forEach((input) => { input.value = ''; });

        handleSearchBehavior();
      });

      activeFacetsContainer.appendChild(tag);
    });
  }

  function updateUrlParams() {
    const newUrlParams = new URLSearchParams();
    if (searchInput.value) newUrlParams.set('query', searchInput.value);

    const booleanlistFacetKeys = new Set((CONFIG.facets || [])
      .filter((facet) => facet.type === 'booleanlist')
      .map((facet) => facet.key));

    Object.entries(state.selectedFacets).forEach(([facetKey, values]) => {
      if (!values.length) return;

      if (booleanlistFacetKeys.has(facetKey)) {
        values.forEach((value) => newUrlParams.set(value, 'true'));
        return;
      }

      newUrlParams.set(facetKey, values.join('|'));
    });

    Object.entries(state.selectedRanges).forEach(([facetKey, range]) => {
      if (range.min) newUrlParams.set(`${facetKey.toLowerCase()}-min`, range.min);
      if (range.max) newUrlParams.set(`${facetKey.toLowerCase()}-max`, range.max);
    });

    const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  function inferUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('query')) searchInput.value = urlParams.get('query');

    const booleanlistValueMap = (CONFIG.facets || [])
      .filter((facet) => facet.type === 'booleanlist')
      .reduce((map, facet) => {
        facet.list.forEach((item) => {
          map[item.key] = facet.key;
        });
        return map;
      }, {});

    urlParams.forEach((value, key) => {
      if (key === 'query') return;

      const normalizedKey = key.toLowerCase();
      if (normalizedKey.endsWith('-min') || normalizedKey.endsWith('-max')) {
        const facetKey = key.slice(0, key.lastIndexOf('-'));
        const normalizedFacetKey = facetKey.charAt(0).toUpperCase() + facetKey.slice(1);
        const bound = normalizedKey.endsWith('-min') ? 'min' : 'max';

        if (!state.selectedRanges[normalizedFacetKey]) state.selectedRanges[normalizedFacetKey] = {min: '', max: ''};
        state.selectedRanges[normalizedFacetKey][bound] = value;
        return;
      }

      if (booleanlistValueMap[key]) {
        const facetKey = booleanlistValueMap[key];
        const featureValue = key;
        if (value === 'true' || value === '') {
          if (!state.selectedFacets[facetKey]) state.selectedFacets[facetKey] = [];
          state.selectedFacets[facetKey].push(featureValue);
        }
        return;
      }

      state.selectedFacets[key] = pruneDiacritics(value).split('|');
    });
  }

  function handleSearchBehavior() {
    const results = submitSearchQuery(idx, resultsLookupMap, state);
    appendSearchInfo(results.length, Object.keys(resultsLookupMap).length);
    renderActiveFacets();
    appendSearchResults(results);
    updateUrlParams();
  }

  function setupFacetCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-facet][data-value]');
    checkboxes.forEach((checkbox) => {
      const facetKey = checkbox.getAttribute('data-facet');
      const facetValue = checkbox.getAttribute('data-value');
      const prunedFacetValue = pruneDiacritics(facetValue);

      if (state.selectedFacets[facetKey] && state.selectedFacets[facetKey].includes(prunedFacetValue)) checkbox.checked = true;

      checkbox.addEventListener('change', function() {
        if (!state.selectedFacets[facetKey]) state.selectedFacets[facetKey] = [];
        if (this.checked) {
          if (!state.selectedFacets[facetKey].includes(prunedFacetValue)) state.selectedFacets[facetKey].push(prunedFacetValue);
        } else {
          state.selectedFacets[facetKey] = state.selectedFacets[facetKey].filter(v => v !== prunedFacetValue);
        }
        handleSearchBehavior();
      });
    });
  }

  function setupFacetRangeInputs() {
    const rangeInputs = document.querySelectorAll('input[type="number"][data-facet][data-range]');
    rangeInputs.forEach((input) => {
      const facetKey = input.getAttribute('data-facet');
      const rangeType = input.getAttribute('data-range');

      if (!state.selectedRanges[facetKey]) state.selectedRanges[facetKey] = {min: '', max: ''};

      const currentValue = state.selectedRanges[facetKey][rangeType] || input.value;
      input.value = currentValue;
      state.selectedRanges[facetKey][rangeType] = currentValue;

      input.addEventListener('change', function() {
        state.selectedRanges[facetKey][rangeType] = this.value;
        handleSearchBehavior();
      });
    });
  }

  await loadApiFacetValues();
  renderFacetPanels();
  inferUrlParams();
  setupFacetCheckboxes();
  setupFacetRangeInputs();
  handleSearchBehavior();

  document.body.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearchBehavior();
  });

  if (searchSubmit) searchSubmit.addEventListener('click', function() { handleSearchBehavior(); }, false);
  if (searchInput) searchInput.addEventListener('keyup', function() { handleSearchBehavior(); }, false);
  if (searchLimitSelect) searchLimitSelect.addEventListener('change', function() { state.selectedSearchField = this.value; handleSearchBehavior(); }, false);

  return {
    getState: () => state,
    refresh: handleSearchBehavior
  };
}
