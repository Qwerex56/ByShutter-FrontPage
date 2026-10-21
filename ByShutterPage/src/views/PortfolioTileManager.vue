<script setup lang="ts">
import PortfolioTileManagerPanel from '@/components/portfolio_tile_manager/PortfolioTileManagerPanel.vue'
</script>

<template>
  <article class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 text-jet-black md:px-10 lg:px-16">
    <RouterLink :to="{ name: 'config' }"
      class="mb-8 inline-block border-b-2 border-jet-black pb-1 font-playfair-display text-xl font-bold uppercase underline underline-offset-4 transition-colors hover:text-olive-wood">
      Back to site configuration</RouterLink>
    <header class="mb-12 max-w-5xl border-b-2 border-jet-black pb-6">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">The visual rhythm</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none md:text-8xl">Portfolio Tile Manager
      </h1>
    </header>
    <PortfolioTileManagerPanel />
  </article>
</template>
