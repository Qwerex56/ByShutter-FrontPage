<script setup lang="ts">
defineProps<{
  heroText?: string
  heroImage?: string
  heroImageAlt?: string
}>()
</script>

<template>
  <article class="flex items-end bg-no-repeat bg-cover bg-center h-dvh"
    :style="{ backgroundImage: `url(${heroImage ?? '/ClockImage.png'})` }">
    <p class="text-8xl text-white m-8 contras font-rouge-script">
      {{ heroText ?? 'Hello not there' }}
    </p>
  </article>
</template>
