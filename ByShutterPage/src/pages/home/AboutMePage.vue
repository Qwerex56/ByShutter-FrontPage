<script setup lang="ts">
const props = defineProps<{
  profileImage?: string,
  profileImageAlt: string,
}>();
</script>

<template>
  <article class="flex flex-col md:flex-row gap-12">
    <h1 class="font-playfair-display text-5xl font-black">
      <slot name="Greetings">

      </slot>
    </h1>

    <img :src="profileImage" :alt="profileImageAlt" loading="lazy" class="place-self-center w-full max-w-[256px]" />

    <article class="flex flex-col gap-4">
      <p class="font-rouge-script text-center text-5xl leading-[0.8]">
        <slot name="Quote">
          To jest bardzo fajny cytat
        </slot>
      </p>

      <p class="px-4 font-inter font-light text-justify text-[14px] max-w-[80ch]">
        <slot name="AboutMe">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
        </slot>
      </p>

      <RouterLink to="/AboutMe"
        class="mt-8 px-9 text-right font-playfair-display text-4xl underline text-jet-black font-bold uppercase">
        About me
      </RouterLink>
    </article>
  </article>
</template>
