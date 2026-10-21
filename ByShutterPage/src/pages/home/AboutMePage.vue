<script setup lang="ts">
defineProps<{
  greetings?: string
  quote?: string
  aboutMe?: string
  profileImage?: string
  profileImageAlt?: string
}>()
</script>

<template>
  <article class="flex flex-col md:flex-row gap-12">
    <h1 class="font-playfair-display text-5xl font-black">{{ greetings }}</h1>

    <img :src="profileImage" :alt="profileImageAlt ?? 'Profile image'" loading="lazy"
      class="place-self-center w-full max-w-[256px]" />

    <article class="flex flex-col gap-4">
      <p class="font-rouge-script text-center text-5xl leading-[0.8]">
        {{ quote ?? 'To jest bardzo fajny cytat' }}
      </p>

      <p class="px-4 font-inter font-light text-justify text-[14px] max-w-[80ch]">
        {{ aboutMe ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }}
      </p>

      <RouterLink to="/AboutMe"
        class="mt-8 px-9 text-right font-playfair-display text-4xl underline text-jet-black font-bold uppercase">
        About me
      </RouterLink>
    </article>
  </article>
</template>
