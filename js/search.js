window.addEventListener("load", (event) => {
  var resultsContainer  = document.getElementById('results');
  var resultsInfo       = document.getElementById('results-info');
  var activeFacetsContainer = document.getElementById('active-facets');
  var searchInput       = document.getElementById("search-input");
  var searchLimitSelect = document.getElementById("search-limit-select");
  var searchSubmit      = document.getElementById("search-submit");
  var urlParams         = new URLSearchParams(window.location.search);

  // State for selected facets, ranged facets, and search field
  const selectedFacets = {};
  const selectedRanges = {};
  let selectedSearchField = 'All Fields';

  function facetKeyToProperty(facetKey) {
    const map = {
      'Language': 'language',
      'Document Type': 'document_type',
      'Year': 'year',
      'Archive': 'archive',
      'Town': 'town_short'
    };
    return map[facetKey] || facetKey.toLowerCase().replaceAll(' ', '_');
  }

  function searchFieldToLunrField(fieldName) {
    const map = {
      'Title': 'Title',
      'Language': 'Language',
      'Document Type': 'Document_Type',
      'Archive': 'Archive',
      'Transcription': 'Transcription',
      'Translation': 'Translation',
      'Year': 'Year',
      'Town': 'Town'
    };
    return map[fieldName] || fieldName;
  }

  function pruneDiacritics(string) {
    let str = String(string);
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('.', '').replaceAll(',', '').replaceAll('(', '').replaceAll(')', '');
  }

  function toQueryString(tokens) {
    return tokens.map((token) => `${token}^100 +${token}*^10 ${token}~2`).join(' ');
  }

  function submitSearchQuery(idx, resultsLookupMap) {
    let query = '* *';
    if (searchInput && searchInput.value) {
      const input = pruneDiacritics(searchInput.value);
      const tokens = input.split(' ');
      
      // Build field-specific query if not searching all fields
      if (selectedSearchField && selectedSearchField !== 'All Fields') {
        const lunrFieldName = searchFieldToLunrField(selectedSearchField);
        query = tokens.map((token) => `${lunrFieldName}:${token}^100 +${lunrFieldName}:${token}*^10 ${lunrFieldName}:${token}~2`).join(' ');
      } else {
        query = toQueryString(tokens);
      }
    }
    
    let results = idx.search(query) || [];

    // Filter by selected facets and ranges
    const activeFacets = Object.entries(selectedFacets).filter(([_, values]) => values.length > 0);
    const activeRanges = Object.entries(selectedRanges).filter(([_key, range]) => range.min !== '' || range.max !== '');

    if (activeFacets.length > 0 || activeRanges.length > 0) {
      results = results.filter((res) => {
        const item = resultsLookupMap[res.ref];

        const facetMatch = activeFacets.every(([facetKey, selectedValues]) => {
          const propName = facetKeyToProperty(facetKey);
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
          const propName = facetKeyToProperty(facetKey);
          if (propName !== 'year') {
            return true;
          }

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

  function truncateString(string){
    let str = String(string);
    let max = 60;
    if (str.length < max) {
      return str;
    }
    else {
      return str.substring(0, max) + "...";
    }
  }

  function randomHexColor() {
    return Math.floor(Math.random() * 256).toString(16).padStart(2, '0') + 
           Math.floor(Math.random() * 128).toString(16).padStart(2, '0') + 
           Math.floor(Math.random() * 64).toString(16).padStart(2, '0');
  }

  function appendSearchResults(results, resultsLookupMap) {
    resultsContainer.innerHTML = null;
    results.forEach(function (res) {
      let item = resultsLookupMap[res.ref];
      let resultDiv = document.createElement('div');
      let hexColor = randomHexColor(); 
      resultDiv.classList.add("w-full", "group", "transition", "duration-350", "ease-in-out", "hover:scale-110");
      resultDiv.innerHTML = `
        <a href="${prefixUrl}document/${ item.slug }.html">          
          <div class="relative h-36 w-full rounded-tl-[3rem] rounded-br-[3rem] overflow-hidden bg-[url(../static/Tl675b.png)] bg-contain bg-center">
            ${ item.language && item.language.startsWith("Zapotec") ? 
              `<div class="absolute top-0 right-0 bg-red-950 text-[#f7efdc] text-lg font-bold px-2 py-1 rounded-bl-lg z-10">Zapotec</div>` 
            : 
            `<div class="absolute top-0 right-0 bg-accent-dark text-[#f7efdc] text-lg font-bold px-2 py-1 rounded-bl-lg z-10">Spanish</div>` 
            }
            <div class="absolute top-0 left-0 w-full h-full block transition-opacity saturate-50 opacity-80 duration-350 ease-in-out group-hover:opacity-0" style="background-color: #${hexColor};"></div>
          </div>
          <div class="mt-4">
            ${ item.title.startsWith("Translation") ? 
              `<h2 class="text-text-dark title-font text-lg font-bold leading-tight">
                <span class="border-b-2 group-hover:text-accent-dark ease-in-out duration-350">${ item.title.substring(0, 11) }</span>
                ${ item.title.substring(11) }
              </h2>`
            :
              `<h2 class="text-text-dark title-font text-lg font-bold leading-tight">${ item.title }</h2>`
            }
          </div>
        </a>`;
      resultsContainer.appendChild(resultDiv);
    })
  }

  function appendSearchInfo(resultsLength, fullIndexLength) {
    resultsInfo.innerHTML = null;
    let infoDiv = document.createElement('div');
    infoDiv.innerHTML = `Showing ${resultsLength} of ${fullIndexLength} results`;
    resultsInfo.appendChild(infoDiv);
  }

  function renderActiveFacets(idx, resultsLookupMap) {
    activeFacetsContainer.innerHTML = null;
    
    // Add search query tag if present
    if (searchInput.value) {
      const queryTag = document.createElement('div');
      queryTag.className = 'inline-flex items-center gap-2 bg-accent-alt-light text-accent-alt-dark px-3 py-1 rounded-full text-xs';
      queryTag.innerHTML = `
      <button class="hover:text-accent-light cursor-pointer" data-query-tag="true">
        <span class="font-mono"><b>Search (${selectedSearchField}):</b> ${searchInput.value}</span>
        <span class="ml-1 font-bold"> × </span>
      </button>
      `;
      
      const removeQueryBtn = queryTag.querySelector('button');
      removeQueryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchInput.value = '';
        handleSearchBehavior(idx, resultsLookupMap);
      });
      
      activeFacetsContainer.appendChild(queryTag);
    }
    
    // Add facet tags
    Object.entries(selectedFacets).forEach(([facetKey, values]) => {
      values.forEach((value) => {
        const tag = document.createElement('div');
        tag.className = 'inline-flex items-center gap-2 bg-accent-alt-light text-accent-alt-dark px-3 py-1 rounded-full text-xs hover:shadow ';
        tag.innerHTML = `
        <button class="hover:text-accent-light cursor-pointer" data-facet="${facetKey}" data-value="${value}">
          <span class="font-mono"><b>${facetKey}:</b> ${value}</span>
          <span class="ml-1 font-bold"> × </span>
        </button>
        `;
        
        const removeBtn = tag.querySelector('button');
        removeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const facetKeyToRemove = this.getAttribute('data-facet');
          const valueToRemove = this.getAttribute('data-value');
          
          selectedFacets[facetKeyToRemove] = selectedFacets[facetKeyToRemove].filter(v => v !== valueToRemove);
          
          // Uncheck the corresponding checkbox
          const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-facet="${facetKeyToRemove}"]`);
          checkboxes.forEach((checkbox) => {
            if (pruneDiacritics(checkbox.getAttribute('data-value')) === valueToRemove) {
              checkbox.checked = false;
            }
          });
          
          handleSearchBehavior(idx, resultsLookupMap);
        });
        
        activeFacetsContainer.appendChild(tag);
      });
    });

    // Add range facet tags
    Object.entries(selectedRanges).forEach(([facetKey, range]) => {
      if (!range.min && !range.max) return;
      const rangeValue = range.min && range.max ? `${range.min}–${range.max}` : range.min ? `≥${range.min}` : `≤${range.max}`;
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
        selectedRanges[facetKeyToRemove] = {min: '', max: ''};

        const rangeInputs = document.querySelectorAll(`input[data-facet="${facetKeyToRemove}"][data-range]`);
        rangeInputs.forEach((input) => {
          input.value = '';
        });

        handleSearchBehavior(idx, resultsLookupMap);
      });

      activeFacetsContainer.appendChild(tag);
    });
  }

  function updateUrlParams() {
    const newUrlParams = new URLSearchParams();
    if (searchInput.value) {
      newUrlParams.set('query', searchInput.value);
    }
    
    Object.entries(selectedFacets).forEach(([facetKey, values]) => {
      if (values.length > 0) {
        newUrlParams.set(facetKey, values.join('|'));
      }
    });

    Object.entries(selectedRanges).forEach(([facetKey, range]) => {
      if (range.min) {
        newUrlParams.set(`${facetKey.toLowerCase()}-min`, range.min);
      }
      if (range.max) {
        newUrlParams.set(`${facetKey.toLowerCase()}-max`, range.max);
      }
    });
    
    const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  function inferUrlParams() {
    if (urlParams.has('query')) {
      searchInput.value = urlParams.get('query');
    }

    // Load facets and range filters from URL params
    urlParams.forEach((value, key) => {
      if (key === 'query') {
        return;
      }

      const normalizedKey = key.toLowerCase();
      if (normalizedKey.endsWith('-min') || normalizedKey.endsWith('-max')) {
        const facetKey = key.slice(0, key.lastIndexOf('-'));
        const normalizedFacetKey = facetKey.charAt(0).toUpperCase() + facetKey.slice(1);
        const bound = normalizedKey.endsWith('-min') ? 'min' : 'max';

        if (!selectedRanges[normalizedFacetKey]) {
          selectedRanges[normalizedFacetKey] = {min: '', max: ''};
        }
        selectedRanges[normalizedFacetKey][bound] = value;
        return;
      }

      selectedFacets[key] = pruneDiacritics(value).split('|');
    });
  }

  function handleSearchBehavior(idx, resultsLookupMap) {
    results = submitSearchQuery(idx, resultsLookupMap);
    appendSearchInfo(results.length, Object.keys(resultsLookupMap).length);
    renderActiveFacets(idx, resultsLookupMap);
    appendSearchResults(results, resultsLookupMap);
    updateUrlParams();
  }

  function toDoc(doc) {
    return {
      'Slug': doc.slug,
      'Title': pruneDiacritics(doc.title),
      'Language': pruneDiacritics(doc.language),
      'Town': pruneDiacritics(doc.town_short),
      'Document_Type': pruneDiacritics(doc.document_type) || '',
      'Transcription': pruneDiacritics(doc.transcription) || '',
      'Translation': pruneDiacritics(doc.translation) || '',
      'Archive': pruneDiacritics(doc.archive) || '',
      'Year': doc.year || ''
    };
  }

  function setupFacetCheckboxes(resultsLookupMap) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-facet]');
    
    checkboxes.forEach((checkbox) => {
      const facetKey = checkbox.getAttribute('data-facet');
      const facetValue = checkbox.getAttribute('data-value');
      const prunedFacetValue = pruneDiacritics(facetValue);
      
      // Initialize checkbox state from URL params
      if (selectedFacets[facetKey] && selectedFacets[facetKey].includes(prunedFacetValue)) {
        checkbox.checked = true;
      }
      
      // Setup change handler
      checkbox.addEventListener('change', function() {
        if (!selectedFacets[facetKey]) {
          selectedFacets[facetKey] = [];
        }
        
        if (this.checked) {
          if (!selectedFacets[facetKey].includes(prunedFacetValue)) {
            selectedFacets[facetKey].push(prunedFacetValue);
          }
        } else {
          selectedFacets[facetKey] = selectedFacets[facetKey].filter(v => v !== prunedFacetValue);
        }
        
        handleSearchBehavior(window.idx, resultsLookupMap);
      });
    });
  }

  function setupFacetRangeInputs(resultsLookupMap) {
    const rangeInputs = document.querySelectorAll('input[type="number"][data-facet][data-range]');
    rangeInputs.forEach((input) => {
      const facetKey = input.getAttribute('data-facet');
      const rangeType = input.getAttribute('data-range');

      if (!selectedRanges[facetKey]) {
        selectedRanges[facetKey] = {min: '', max: ''};
      }

      const currentValue = selectedRanges[facetKey][rangeType] || input.value;
      input.value = currentValue;
      selectedRanges[facetKey][rangeType] = currentValue;

      input.addEventListener('change', function() {
        selectedRanges[facetKey][rangeType] = this.value;
        handleSearchBehavior(window.idx, resultsLookupMap);
      });
    });
  }

  promisedData.then(function(data) {
    const resultsLookupMap = data.reduce(function (memo, doc) {
      memo[doc.slug] = doc
      return memo
    }, {});

    let idx = lunr(function () {
      this.ref('Slug');
      this.field('Slug');
      this.field('Title');
      this.field('Town');
      this.field('Language');
      this.field('Transcription');
      this.field('Translation');
      this.field('Archive');
      this.field('Document_Type');
      this.field('Year');

      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);
      this.pipeline.remove(lunr.stopWordFilter);
      this.searchPipeline.remove(lunr.stopWordFilter);

      data.forEach(function (doc) {
        this.add(toDoc(doc))
      }, this)
    })

    // Store idx globally for use in search handlers
    window.idx = idx;

    inferUrlParams();
    setupFacetCheckboxes(resultsLookupMap);
    setupFacetRangeInputs(resultsLookupMap);
    handleSearchBehavior(idx, resultsLookupMap);

    document.body.addEventListener('keypress', function(e) {
      if (e.key === "Enter") {
        handleSearchBehavior(idx, resultsLookupMap);
      }
    });

    searchSubmit.addEventListener('click', function() { 
      handleSearchBehavior(idx, resultsLookupMap);
    }, false);

    searchInput.addEventListener('keyup', function() { 
      handleSearchBehavior(idx, resultsLookupMap);
    }, false);

    searchLimitSelect.addEventListener('change', function() {
      selectedSearchField = this.value;
      handleSearchBehavior(idx, resultsLookupMap);
    }, false);
  });
});
