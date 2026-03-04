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
      let thumbnail = `https://ticha.haverford.edu/static/img/levanto_arte_example.JPG`;
      resultDiv.classList.add("xl:w-1/6", "lg:w-1/5", "md:w-1/3", "w-full", "transition", "duration-250", "ease-in-out", "hover:scale-105");
      resultDiv.innerHTML = `
        <a href="${prefixUrl}document/${ item.slug }.html">
          <div class="block relative h-48 rounded overflow-hidden">
            <img alt="" class="object-cover object-center w-full h-full block" src="${ thumbnail }">
          </div>
          <div class="mt-4">
            <h3 class="text-red-700 text-xs tracking-widest title-font mb-1 uppercase">${ item.language } Language</h3>
            <h2 class="text-gray-900 title-font text-lg font-bold leading-tight">${ item.title }</h2>
          </div>
        </a>`;
      // <div class="my-4 h-full transition-all duration-500 hover:scale-105"><a href="${prefixUrl}item/${item.ID}.html"><img loading="lazy" src="${ thumbnail }" alt="thumbnail for ${truncateString(item.Title)}" class="max-w-full h-auto"><div class="mt-2 leading-snug md:text-sm text-xs">${truncateString(item.Title)}</div></a></div>`;
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