---
title: "A Guide to Using the Ticha Document Explorer"
description: ""
layout: "base"
permalink: "/get-started/guide.html"
browse_blocks:
  - label: 'Browse by Place'
    link: ''
    description: ''
    icon: ''
  - label: 'Browse by Year'
    link: ''
    description: ''
    icon: ''
  - label: 'Browse by People'
    link: ''
    description: ''
    icon: ''
  - label: 'Browse by Archive'
    link: ''
    description: ''
    icon: ''
  - label: 'Browse by Type'
    link: ''
    description: ''
    icon: ''
---
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20">
      <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
        <h3 class="text-xs text-red-700 tracking-widest font-medium title-font mb-1 uppercase">Get Started</h3>
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{{ title }}</h1>
        <div class="h-1 w-20 bg-red-700 rounded mt-4"></div>
      </div>
      <div class="lg:w-1/2 w-full lg:pl-6">
        <p class="leading-relaxed text-gray-500 mb-2">The Ticha Document Explorer allows users to access and explore many interlinked layers of texts from a corpus of Colonial Valley Zapotec manuscripts and printed books, including images of the original documents, transcriptions, translations, and linguistic analysis, including morphological interlinearization.</p>
        <p class="leading-relaxed text-gray-500 mb-2">Ticha itself is an international effort to document and promote Zapotec languages and knowledge through workshops, events, and online resources provided to the public at no cost. We enouage you to browse our main website to learn more about what we do and the resources you can use.</p>
      </div>
    </div>
    <div class="my-6">
      <h2 class="md:text-2xl text-xl font-medium title-font text-gray-900">Exploring By Category</h2>
    </div>
    <div class="container mx-auto flex flex-wrap mb-12">
      <div class="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
        <img alt="feature" class="object-cover object-center w-full" src="https://dummyimage.com/460x500">
        <p class="text-xs text-red-700 tracking-widest font-medium title-font my-2 uppercase">Above: Translation of Bill of Sale from San Jerónimo Tlacochahuaya, 1675</p>
      </div>
      <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
        {% for block in browse_blocks %}
        <div class="flex flex-col mb-10 lg:items-start items-center">
          <div class="flex-grow">
            <div class="flex items-baseline">
              <div class="w-6 h-6 inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 mr-2 float-left">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-3 h-3" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h2 class="text-gray-900 text-lg title-font font-medium mb-3">{{ block.label }}</h2>
            </div>
            <p class="leading-relaxed text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pulvinar accumsan ex ultrices congue.</p>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
    <div class="my-6">
      <h2 class="md:text-2xl text-xl font-medium title-font text-gray-900">Primary Document or Digital Edition?</h2>
    </div>
    <div class="max-w-[75ch]">
      <p class="leading-relaxed text-gray-500 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium massa eget augue pulvinar viverra. Morbi dapibus leo urna, id egestas eros ornare euismod. Proin elit augue, tincidunt a mollis in, interdum et nisi. Pellentesque sed faucibus turpis. Praesent at elit justo. Quisque hendrerit ipsum at faucibus vulputate. Aenean sodales eget justo vitae varius. Maecenas pulvinar vestibulum justo.</p>
    </div>
    <div class="mt-12 mb-6">
      <h2 class="md:text-2xl text-xl font-medium title-font text-gray-900">Using the Linguistic Analyses</h2>
    </div>
    <div class="max-w-[75ch]">
      <p class="leading-relaxed text-gray-500 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium massa eget augue pulvinar viverra. Morbi dapibus leo urna, id egestas eros ornare euismod. Proin elit augue, tincidunt a mollis in, interdum et nisi. Pellentesque sed faucibus turpis. Praesent at elit justo. Quisque hendrerit ipsum at faucibus vulputate. Aenean sodales eget justo vitae varius. Maecenas pulvinar vestibulum justo.</p>
      <p class="leading-relaxed text-gray-500 mb-2">Morbi porttitor ut tellus eu blandit. Mauris consectetur ante eros, at tempor massa vulputate sit amet. In hac habitasse platea dictumst. Curabitur quis ex vestibulum, malesuada sapien in, faucibus odio. In ultricies nulla sapien, vel pharetra nunc hendrerit eget. Curabitur tincidunt augue quis mauris hendrerit, quis tincidunt sapien luctus. Phasellus dignissim ex sit amet eros accumsan aliquet. Nulla facilisi. Aenean libero massa, viverra et odio et, dictum posuere quam. Curabitur sed dolor ut diam varius lobortis. Vestibulum porta tortor sit amet eleifend vehicula. Ut finibus suscipit ligula lobortis scelerisque.</p>
      <p class="leading-relaxed text-gray-500 mb-2">Sed commodo tempor tincidunt. Etiam turpis sem, porttitor eget purus sit amet, eleifend venenatis massa. Quisque porta orci quis libero mollis hendrerit. Sed in lobortis metus, vitae tincidunt tortor. Curabitur porta odio id dignissim molestie. Praesent pellentesque risus erat. Sed pretium risus eu risus elementum ultrices et sit amet sem. Quisque quis dignissim urna. Vestibulum malesuada convallis tortor, non lacinia massa iaculis eget. Donec consequat ligula ac nunc dictum, ac malesuada tortor venenatis.</p>
      <p class="leading-relaxed text-gray-500 mb-2">Sed efficitur est vel vestibulum auctor. Integer vitae efficitur lacus, non dapibus mauris. Aliquam purus nibh, suscipit id vulputate a, pulvinar et quam. Donec aliquet euismod orci, in egestas magna elementum vitae. Duis sed congue enim. Suspendisse malesuada sollicitudin nunc bibendum sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque pharetra massa nisl, sit amet mollis dolor molestie ut. </p>
    </div>
    <div class="mt-12 mb-6">
      <h2 class="md:text-2xl text-xl font-medium title-font text-gray-900">Connecting to the Ticha Webonary Dictionary</h2>
    </div>
    <div class="max-w-[75ch]">
      <p class="leading-relaxed text-gray-500 mb-2">Sed efficitur est vel vestibulum auctor. Integer vitae efficitur lacus, non dapibus mauris. Aliquam purus nibh, suscipit id vulputate a, pulvinar et quam. Donec aliquet euismod orci, in egestas magna elementum vitae. Duis sed congue enim. Suspendisse malesuada sollicitudin nunc bibendum sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque pharetra massa nisl, sit amet mollis dolor molestie ut. </p>
    </div>
  </div>
</section>
