document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('[data-edition-controls]');
  const transcription = document.querySelector('[data-edition-transcription]');
  const analysis = document.querySelector('[data-edition-analysis]');

  if (!controls || !transcription || !analysis) {
    return;
  }

  const state = {
    baseUrl: controls.dataset.editionBaseUrl,
    page: 1,
    pageCount: Number(controls.dataset.editionPageCount),
    cache: new Map(),
  };

  const pageInput = controls.querySelector('[data-edition-page]');
  const transcriptionStatus = controls.parentElement.querySelector('[data-edition-status]');
  const analysisStatus = analysis.parentElement.querySelector('[data-edition-analysis-status]');

  const setStatus = (element, message) => {
    if (element) {
      element.textContent = message;
    }
  };

  const importFragment = (target, source) => {
    target.replaceChildren(...Array.from(source.childNodes).map((node) => document.importNode(node, true)));
  };

  const sanitize = (fragment) => {
    fragment.querySelectorAll('script, style, iframe, object, embed, form').forEach((element) => element.remove());
    fragment.querySelectorAll('*').forEach((element) => {
      [...element.attributes].forEach((attribute) => {
        if (attribute.name.toLowerCase().startsWith('on') || attribute.name.toLowerCase() === 'style') {
          element.removeAttribute(attribute.name);
        }
      });
    });
    return fragment;
  };

  const transcriptionFragment = (source) => {
    const fragment = source.cloneNode(true);
    fragment.querySelectorAll('.itx_morphemes, .itx_gls, .itx_Freeform_lit, .itx_Freeform_gls').forEach((element) => element.remove());
    return fragment;
  };

  const loadPage = async (page) => {
    const pageName = String(page).padStart(3, '0');
    const pageUrl = `${state.baseUrl}/${pageName}.html`;
    setStatus(transcriptionStatus, `Loading transcription page ${page}...`);
    setStatus(analysisStatus, `Loading analysis page ${page}...`);

    try {
      let source = state.cache.get(page);
      if (!source) {
        const response = await fetch(pageUrl);
        if (!response.ok) {
          throw new Error(`Source returned ${response.status}`);
        }
        const html = await response.text();
        source = document.createElement('div');
        source.innerHTML = html;
        sanitize(source);
        state.cache.set(page, source);
      }

      importFragment(transcription, transcriptionFragment(source));
      importFragment(analysis, source);
      setStatus(transcriptionStatus, `Transcription page ${page} of ${state.pageCount}`);
      setStatus(analysisStatus, `Analysis page ${page} of ${state.pageCount}`);
    } catch (error) {
      transcription.replaceChildren();
      analysis.replaceChildren();
      const message = document.createElement('p');
      message.textContent = 'This page could not be loaded. Open the source edition to continue.';
      message.className = 'text-text-light';
      transcription.append(message.cloneNode(true));
      analysis.append(message);
      setStatus(transcriptionStatus, 'Transcription unavailable');
      setStatus(analysisStatus, 'Analysis unavailable');
      console.error('Could not load digital edition page', error);
    }
  };

  const setPage = (nextPage) => {
    state.page = Math.min(Math.max(Number(nextPage) || 1, 1), state.pageCount);
    pageInput.value = state.page;
    controls.querySelector('[data-edition-prev]').disabled = state.page === 1;
    controls.querySelector('[data-edition-first]').disabled = state.page === 1;
    controls.querySelector('[data-edition-next]').disabled = state.page === state.pageCount;
    controls.querySelector('[data-edition-last]').disabled = state.page === state.pageCount;
    loadPage(state.page);
  };

  controls.querySelector('[data-edition-first]').addEventListener('click', () => setPage(1));
  controls.querySelector('[data-edition-prev]').addEventListener('click', () => setPage(state.page - 1));
  controls.querySelector('[data-edition-next]').addEventListener('click', () => setPage(state.page + 1));
  controls.querySelector('[data-edition-last]').addEventListener('click', () => setPage(state.pageCount));
  pageInput.addEventListener('change', () => setPage(pageInput.value));

  setPage(1);
});
