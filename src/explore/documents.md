---
section: Explore
title: "All Documents"
layout: "base"
permalink: "/explore/documents.html"
---

{% include "components/headers/search.html" %}
<main class="flex-1">
  <section class="text-text-light body-font">
    <div class="container px-5 py-12 mx-auto">
      <div class="flex md:flex-nowrap gap-12 flex-wrap w-full">
        <button id="showAdvancedSearchFeaturesButton" type="button" class="md:hidden bg-accent-light inline-flex items-center hover:bg-accent-dark text-neutral-light rounded-lg px-3 py-1 text-sm font-bold">Show Advanced Search Features</button>
        <div id="advancedSearchFeatures" class="basis-full md:basis-1/3 xl:basis-1/4 hidden md:block">
          <ul id="facet-panels"></ul>
        </div>
        <div class="basis-full md:basis-2/3 xl:basis-3/4">
          <div id="results-info" class="mb-6 font-bold"></div>
          <div id="active-facets" class="flex flex-wrap gap-2 mb-12"></div>
          <div id="results" class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-12 flex-wrap justify-between w-full"></div>
      </div>
    </div>
  </section>
</main>
<script type="module" src="{{ '/js/search.js' }}"></script>
<script type="module" src="{{ '/js/showAdvancedSearch.js' }}"></script>
