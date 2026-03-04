---
title: "Find and Access Ticha Primary Documents"
layout: "base"
permalink: "/explore/documents.html"
facets:
  - key: Language
    values:
      - Zapotec
      - Spanish
  - key: Document Type
    values:
      - Bill of Sale
      - Testament
      - Land Deed
      - Receipt
      - Petition
      - Complaint
      # - Land Description
  - key: Archive
    values:
      - "Archivo General de la Nación"
      - "Archivo General del Poder Ejecutivo del Estado de Oaxaca"
      - "Archivo Histórico de Notarias del Estado de Oaxaca"
      - "Archivo Histórico de Tlacolula de Matamoros Oaxaca"
  - key: Collection
    values:
      - Rodriguez, Joseph
      - Real Intendencia
      - Alcaldias Mayores
      - Joachin de Amador
      - Tierras

  # - key: Limit Unless
  #   values:
  #    - "Has Translation Document"
  #    - "Has Linguistic Analysis"
  #    - "Has Full Text Transcription"
  #    - "Has Full Text Translation"
---

<section class="text-gray-600 body-font">
  <div class="lg:container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20">
      <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
        <h3 class="text-xs text-red-700 tracking-widest font-medium title-font mb-1 uppercase">Explore</h3>
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{{ title }}</h1>
        <div class="h-1 w-20 bg-red-700 rounded mt-4"></div>
      </div>
      <div class="lg:w-1/2 w-full"></div>
    </div>
    <div class="container mx-0">
      <div class="flex flex-wrap w-full">
        <div class="xl:w-1/6 lg:w-1/5 md:w-1/3 w-full">
          <h2 class="font-bold text-2xl tracking-tight mb-4">Filter Results</h2>
          <ul>
            {%- for facet in facets -%}
            <li class="pb-6 pr-6">
              <div class="text-xl tracking-tight my-1">{{ facet.key }}</div>
              <ul>
                {%- for value in facet.values -%}
                <li class="py-1 pl-2"><a data="{{ value | remove: ',' | remove: '.' }}" class="link hover:text-accent" href="{{ '/explore/documents.html' }}?limit={{ facet.key | uri_encode }}&query={{ value | uri_encode }}">{{ value }}</a></li>
                {%- endfor -%}
              </ul>
            </li>
            {%- endfor -%}
          </ul>
        </div>
        <div class="xl:w-5/6 lg:w-4/5 md:w-2/3 w-full px-4">
          <h2 class="font-bold text-2xl tracking-tight mb-4">Search</h2>
          {% include "partials/searchbar.html" %}
          <div id="results-info" class="my-6"></div>
          <div id="results" class="flex flex-wrap gap-12 justify-start"></div>
      </div>
    </div>
  </div>
</section>

<script src="{{ '/js/search.js' }}"></script>
