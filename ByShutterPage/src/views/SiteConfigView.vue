<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 text-jet-black md:px-10 lg:px-16">
    <header class="mb-16 max-w-5xl border-b-2 border-jet-black pb-8">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">The control room</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none md:text-8xl">
        Configure site
      </h1>
      <p class="mt-6 max-w-[52ch] font-inter text-base font-light leading-relaxed text-jet-black/80">
        Shape the images, albums and content that make up your portfolio.
      </p>
    </header>

    <section class="grid max-w-6xl gap-3 font-inter sm:grid-cols-2">
      <RouterLink to="/config/files"
        class="group flex min-h-44 flex-col justify-between bg-jet-black p-5 text-white-smoke transition-transform duration-200 hover:-translate-y-1">
        <span class="font-rouge-script text-4xl text-bone">01</span>
        <span
          class="font-playfair-display text-4xl font-black uppercase underline decoration-1 underline-offset-4 transition-colors group-hover:text-bone">
          Manage files
        </span>
      </RouterLink>

      <RouterLink to="/config/albums"
        class="group flex min-h-44 flex-col justify-between bg-bone p-5 text-jet-black transition-transform duration-200 hover:-translate-y-1">
        <span class="font-rouge-script text-4xl text-olive-wood">02</span>
        <span
          class="font-playfair-display text-4xl font-black uppercase underline decoration-1 underline-offset-4 transition-colors group-hover:text-olive-wood">
          Manage albums
        </span>
      </RouterLink>

      <RouterLink to="/config/tiles"
        class="group flex min-h-44 flex-col justify-between border-2 border-jet-black p-5 text-jet-black transition-colors hover:bg-olive-wood hover:text-white-smoke">
        <span class="font-rouge-script text-4xl text-olive-wood group-hover:text-bone">03</span>
        <span class="font-playfair-display text-4xl font-black uppercase underline decoration-1 underline-offset-4">
          Manage tiles
        </span>
      </RouterLink>

      <RouterLink to="/config/profiles"
        class="group flex min-h-44 flex-col justify-between border-2 border-jet-black p-5 text-jet-black transition-colors hover:bg-jet-black hover:text-white-smoke">
        <span class="font-rouge-script text-4xl text-olive-wood group-hover:text-bone">04</span>
        <span
          class="font-playfair-display text-4xl font-black uppercase underline decoration-1 underline-offset-4 group-hover:text-bone">
          Manage profiles
        </span>
      </RouterLink>
    </section>
  </main>
</template>
