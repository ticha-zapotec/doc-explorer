---
title: "Find and Access Documents by Archive"
layout: "base"
permalink: "/explore/archive.html"
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
        <p class="leading-relaxed text-gray-500 mb-2"></p>
    </div>
  </div>
  <div class="my-6">
    <h2 class="md:text-2xl text-xl font-medium title-font text-gray-900 mb-6">Archives</h2>
    <ul class="list-disc text-red-700">
      {% for archive in archives %}
      <li><a class="hover:text-red-800" href="#">{{ archive }}</a></li>
      {% endfor %}
    </ul>
  </div>
</section>
