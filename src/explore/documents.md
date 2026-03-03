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
      - Land Description
  - key: Archive
    values:
     - "Archivo General de la Nación"
     - "Archivo General del Poder Ejecutivo del Estado de Oaxaca"
     - "Archivo Histórico de Notarias del Estado de Oaxaca"
     - "Archivo Histórico de Tlacolula de Matamoros Oaxaca"
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
                {%- comment -%}
                {%- assign first_values = facet.values | limit: 6 -%}
                {%- assign last_values = facet.values | slice: 6, facet.values.size  -%}
                {%- endcomment -%}
                {%- for value in facet.values -%}
                <li class="py-1 pl-2"><a data="{{ value | remove: ',' | remove: '.' }}" class="link hover:text-accent" href="{{ '/explore/documents.html' | url }}?limit={{ facet.key | uri_encode }}&query={{ value | uri_encode }}">{{ value }}</a></li>
                {%- endfor -%}
              </ul>
            </li>
            {%- endfor -%}
          </ul>
        </div>
        <div class="xl:w-5/6 lg:w-4/5 md:w-2/3 w-full px-4">
          <h2 class="font-bold text-2xl tracking-tight mb-4">Search</h2>
          {%- comment -%}
          PASTED
          {%- endcomment -%}
          <div class="w-full mb-12">
            <div class="relative mt-2">
                <div class="absolute top-1 left-1 flex items-center">
                <button id="dropdownButton" class="rounded border border-transparent py-1 px-1.5 text-center flex items-center text-sm transition-all text-slate-600">
                  <span id="dropdownSpan" class="text-ellipsis overflow-hidden">All Fields</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 ml-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div class="h-6 border-l border-slate-200 ml-1"></div>
                <div id="dropdownMenu" class="min-w-[150px] overflow-hidden absolute left-0 w-full mt-10 hidden w-full bg-white border border-slate-200 rounded-md shadow-lg z-10">
                  <ul id="dropdownOptions">
                    <li class="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer" data-value="All">All Fields</li>
                    <li class="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer" data-value="Transcription">Transcription</li>
                    <li class="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer" data-value="Translation">Translation</li>
                    <li class="px-4 py-2 text-slate-600 hover:bg-slate-5- text-sm cursor-pointer" data-value="Archive">Archive</li>
                    <li class="px-4 py-2 text-slate-600 hover:bg-slate-5- text-sm cursor-pointer" data-value="Title">Title</li>
                    <li class="px-4 py-2 text-slate-600 hover:bg-slate-5- text-sm cursor-pointer" data-value="Witnesses">Witnesses</li>
                  </ul>
                </div>
              </div>
              <input
                type="text"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-12 pl-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Search" />
              <button class="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd"></path>
                </svg>
              </button> 
            </div>   
          </div>
          <script>
            document.getElementById('dropdownButton').addEventListener('click', function() {
              var dropdownMenu = document.getElementById('dropdownMenu');
              if (dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.remove('hidden');
              } else {
                dropdownMenu.classList.add('hidden');
              }
            });
            document.getElementById('dropdownOptions').addEventListener('click', function(event) {
              if (event.target.tagName === 'LI') {
                const dataValue = event.target.getAttribute('data-value');
                document.getElementById('dropdownSpan').textContent = dataValue;
                document.getElementById('dropdownMenu').classList.add('hidden');
              }
            });
            document.addEventListener('click', function(event) {
              var isClickInside = document.getElementById('dropdownButton').contains(event.target) || document.getElementById('dropdownMenu').contains(event.target);
              var dropdownMenu = document.getElementById('dropdownMenu');
              if (!isClickInside) {
                dropdownMenu.classList.add('hidden');
              }
            });
          </script>
          {%- comment -%}
          PASTED
          {%- endcomment -%}
          <p class="mb-6">Found {{ documents.size }} results</p>
          <div class="flex flex-wrap gap-12 justify-start">
          {%- for document in documents -%}
            <a href="/document/{{ document.slug }}" class="xl:w-1/6 lg:w-1/5 md:w-1/3 w-full transition duration-250 ease-in-out hover:scale-105">
              <div class="block relative h-48 rounded overflow-hidden">
                <img alt="" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/420x260">
              </div>
              <div class="mt-4">
                <h3 class="text-red-700 text-xs tracking-widest title-font mb-1 uppercase">{{ document.language }} Language</h3>
                <h2 class="text-gray-900 title-font text-lg font-bold leading-tight">{{ document.title }}</h2>
              </div>
            </a>
          {%- endfor -%}
        </div>
      </div>
    </div>
  </div>
</section>
