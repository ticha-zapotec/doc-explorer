import { pruneDiacritics } from './utils.js';

/*
 * toDoc(doc)
 * Convert a document object into the canonical shape used by Lunr.
 */
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
    'Collection': pruneDiacritics(doc.collection) || '',
    'Date': pruneDiacritics(doc.date) || '',
    'Year': doc.year || ''
  };
}

/*
 * buildIndex(data, CONFIG)
 * Build a Lunr index from the provided data using the fields in CONFIG.
 * Returns { idx, resultsLookupMap }
 */
export function buildIndex(data, CONFIG) {
  const resultsLookupMap = data.reduce(function (memo, doc) {
    memo[doc.slug] = doc;
    return memo;
  }, {});

  let idx = lunr(function () {
    const refField = CONFIG.refField || 'Slug';
    this.ref(refField);

    const fields = CONFIG.lunrFields || ['Slug','Title','Town','Language','Transcription','Translation','Archive','Document_Type','Year'];
    fields.forEach(function(field) { this.field(field) }.bind(this));

    this.pipeline.remove(lunr.stemmer);
    this.searchPipeline.remove(lunr.stemmer);
    this.pipeline.remove(lunr.stopWordFilter);
    this.searchPipeline.remove(lunr.stopWordFilter);

    data.forEach(function (doc) {
      this.add(toDoc(doc));
    }, this);
  });

  return { idx, resultsLookupMap };
}
