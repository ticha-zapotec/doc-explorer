window.addEventListener("load", (event) => {
  var resultsContainer  = document.getElementById('results');
  var resultsInfo       = document.getElementById('results-info');
  var searchInput       = document.getElementById("search-input");
  var searchLimit       = document.getElementById("search-limit-select");
  var limitOptions      = Array.from(searchLimit.options).map((opt) => opt.value);
  var searchSubmit      = document.getElementById("search-submit");
  var urlParams         = new URLSearchParams(window.location.search);

  function toQueryString(tokens) {
    if (searchLimit.value == 'All Fields') {
      return tokens.map((token) => `${token}^100 +${token}*^10 ${token}~2`).join(' ')
    }
    else {
      limitStr = searchLimit.value.replaceAll(" ", "_");
      return tokens.map((token) => `${limitStr}:${token}^100 +${limitStr}:${token}*^10 ${limitStr}:${token}~2`).join(' ');
    }
  }

  function pruneDiacritics(string) {
    let str = String(string);
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('.', '').replaceAll(',', '').replaceAll('(', '').replaceAll(')', '');
  }

  function submitSearchQuery(idx) {
    let query = '* *'
    if (searchInput && searchInput.value) {
      input = pruneDiacritics(searchInput.value);
      elem = document.querySelector(`[data='${searchInput.value}']`);
      if (elem) { elem.classList.add('text-secondary'); }
      tokens = input.split(' ');
      query = toQueryString(tokens);
    }  
    return idx.search(query) || [];
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

  function appendSearchResults(results, resultsLookupMap) {
    resultsContainer.innerHTML = null;
    results.forEach(function (res) {
      let item = resultsLookupMap[res.ref];
      let resultDiv = document.createElement('div');
      let randomHex = Math.floor(Math.random() * 256).toString(16).padStart(2, '0') + 
                      Math.floor(Math.random() * 128).toString(16).padStart(2, '0') + 
                      Math.floor(Math.random() * 64).toString(16).padStart(2, '0'); 
      resultDiv.classList.add("group", "xl:w-1/6", "lg:w-1/5", "md:w-1/3", "sm:-1/2", "w-full", "transition", "duration-350", "ease-in-out", "hover:scale-110");
      resultDiv.innerHTML = `
        <a href="${prefixUrl}document/${ item.slug }.html">          
          <div class="block relative h-32 w-full rounded-tl-[3rem] rounded-br-[3rem] overflow-hidden bg-[url(../static/Tl675b.png)] bg-contain bg-center">
            ${ item.language && item.language.startsWith("Zapotec") ? 
              `<div class="absolute top-0 right-0 bg-red-950 text-[#f7efdc] text-lg font-bold px-2 py-1 rounded-bl-lg z-10">Zapotec</div>` 
            : 
            `<div class="absolute top-0 right-0 bg-red-800 text-[#f7efdc] text-lg font-bold px-2 py-1 rounded-bl-lg z-10">Spanish</div>` 
            }
            <div class="absolute top-0 left-0 w-full h-full block transition-opacity saturate-50 opacity-80 duration-350 ease-in-out group-hover:opacity-0" style="background-color: #${randomHex};"></div>
          </div>
          <div class="mt-4">
            ${ item.title.startsWith("Translation") ? 
              `<h2 class="text-gray-900 title-font text-lg font-bold leading-tight">
                <span class="border-b-2 group-hover:text-red-800 ease-in-out duration-350">${ item.title.substring(0, 11) }</span>
                ${ item.title.substring(11) }
              </h2>`
            :
              `<h2 class="text-gray-900 title-font text-lg font-bold leading-tight">${ item.title }</h2>`
            }
          </div>
        </a>`;
      resultsContainer.appendChild(resultDiv);
    })
  }

  function appendSearchInfo(results) {
    resultsInfo.innerHTML = null;
    let infoDiv = document.createElement('div');
    infoDiv.innerHTML = `Found ${results.length} results`;
    resultsInfo.appendChild(infoDiv);
  }

  function inferUrlParams(){
    if (urlParams.has('limit') && limitOptions.includes(urlParams.get('limit')) ) {
      searchLimit.value = urlParams.get('limit');
    }

    if (urlParams.has('query')) {
      searchInput.value = urlParams.get('query');
    }
  }

  function handleSearchBehavior(idx, resultsLookupMap){
    results = submitSearchQuery(idx);
    appendSearchInfo(results);
    appendSearchResults(results, resultsLookupMap);
    // Update URL parameters
    const newUrlParams = new URLSearchParams();
    if (searchInput.value) {
      newUrlParams.set('query', searchInput.value);
    }
    if (searchLimit.value && searchLimit.value !== 'All Fields') {
      newUrlParams.set('limit', searchLimit.value);
    }
    const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  function toDoc(doc) {
    return {
      'Slug': doc.slug,
      'Title': pruneDiacritics(doc.title),
      'Language': pruneDiacritics(doc.language),
      'Document_Type': pruneDiacritics(doc.document_type) || '',
      'Transcription': pruneDiacritics(doc.transcription) || '',
      'Translation': pruneDiacritics(doc.translation) || '',
      'Archive': pruneDiacritics(doc.archive) || '',
      'Witnesses': pruneDiacritics(doc.witnesses) || '',
      'Year': doc.year || '',
      'Collection': doc.collection|| ''
    };
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
      this.field('Language');
      this.field('Transcription');
      this.field('Translation');
      this.field('Archive');
      this.field('Witnesses');
      this.field('Document_Type');
      this.field('Year');
      this.field('Collection');

      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);
      this.pipeline.remove(lunr.stopWordFilter);
      this.searchPipeline.remove(lunr.stopWordFilter);

      data.forEach(function (doc) {
        this.add(toDoc(doc))
      }, this)
    })

    inferUrlParams();
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
    searchLimit.addEventListener('change', function() {
      handleSearchBehavior(idx, resultsLookupMap);
    }, false);
  });
});