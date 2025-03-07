---
title: "Ticha Digital Editions"
layout: "base"
permalink: "/explore/editions.html"
---

<section class="text-gray-600 body-font">
  <div class="lg:container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20">
      <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
        <h3 class="text-xs text-red-700 tracking-widest font-medium title-font mb-1 uppercase">Explore</h3>
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{{ title }}</h1>
        <div class="h-1 w-20 bg-red-700 rounded mt-4"></div>
      </div>
      <div class="lg:w-1/2 w-full">
      <p class="leading-relaxed text-gray-500 mb-2">Ticha Digital Editions are specially curated documents with additional critical ___ and linguistic ___. Read more in our ___ guide.</p>
    </div>
  </div>


  <div class="container py-24 mx-auto">
    <div class="flex flex-wrap gap-12 justify-start">
      {%- for edition in editions -%}
      <div class="xl:w-1/6 lg:w-1/5 md:w-1/3 w-full transition duration-250 ease-in-out hover:scale-105">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/420x260">
        </a>
        <div class="mt-4">
          <h3 class="text-red-700 text-xs tracking-widest title-font mb-1 uppercase">Digital Edition</h3>
          <h2 class="text-gray-900 title-font text-lg font-bold leading-tight">{{ edition.title }}</h2>
          <p class="mt-1 text-xs">{{ edition.subtitle }}</p>
        </div>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>

