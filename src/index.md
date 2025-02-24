---
title: "Home"
description: ""
layout: "base"
permalink: "/index.html"
cards:
  - label: 'A Guide to Using the Ticha Document Explorer'
    eyebrow: 'Get Started'
    img: 'https://ticha.haverford.edu/static/img/flowers_copy.jpg'
    link: '/get-started/guide'
  - label: 'Find and Access All Primary Documents'
    eyebrow: 'Explore'
    img: 'https://ticha.haverford.edu/static/img/linguistic-background_DSC_0245.jpg'
    link: '/explore/all'
  - label: 'Browse Digital Editions'
    eyebrow: 'Explore'
    img: 'https://ticha.haverford.edu/static/img/doctrina_images/doctrina_example.png'
    link: '/explore/editions'
  - label: 'Interact with Document Maps and Statistics'
    eyebrow: 'Visualize'
    img: '/static/map-screen.png'
    link: '/visualize/'
  # - label: 'Share Your Ideas and Experience with Us'
  #   eyebrow: 'Connect'
  #   img: ''
  #   link: '/connect/contact'
---
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20">
      <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
      <h3 class="text-xs text-red-700 tracking-widest font-medium title-font mb-1 uppercase">Home</h3>
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Padziuxh <span class="text-red-700 font-extralight">la</span> Bienvenidos <span class="text-red-700  font-extralight">y</span>  Welcome</h1>
        <div class="h-1 w-20 bg-red-700 rounded mt-4"></div>
      </div>
      <div class="lg:w-1/2 w-full">
        <p class="leading-relaxed text-gray-500 mb-2">The Ticha Document Explorer allows users to access and explore many interlinked layers of texts from a corpus of Colonial Valley Zapotec manuscripts and printed books, including images of the original documents, transcriptions, translations, and linguistic analysis, including morphological interlinearization.</p>
        <p class="leading-relaxed text-gray-500 mb-2">Ticha itself is an international effort to document and promote Zapotec languages and knowledge through workshops, events, and online resources provided to the public at no cost. We enouage you to browse our main website to learn more about what we do and the resources you can use.</p>
      </div>
    </div>
    <div class="flex flex-wrap -m-4">
      {% for card in cards %}
      <div class="xl:w-1/4 md:w-1/2 p-4">
        <a href="{{ card.link }}">
          <div class="bg-[#ffffff] p-6 rounded-lg shadow-xl hover:shadow-md">
            <img class="h-40 rounded w-full object-cover object-center mb-6" src="{{ card.img | default: 'https://dummyimage.com/720x400 '}}" alt="content">
            <h3 class="uppercase tracking-widest text-red-700 text-xs font-medium title-font">{{ card.eyebrow }}</h3>
            <h2 class="text-lg text-gray-900 font-medium title-font mb-4">{{ card.label }}</h2>
            <!-- <p class="leading-relaxed text-base"></p> -->
          </div>
        </a>
      </div>
      {% endfor %}
    </div>
  </div>
</section>