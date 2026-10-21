<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav v-if="$route.name !== 'config'" ref="navbar"
    class="p-4 px-8 bg-jet-black/70 backdrop-blur-sm flex z-50 hover:bg-jet-black/95 ">
    <RouterLink to="/home" class="text-3xl text-white-smoke font-inter font-bold tracking-widest">
      ByShutter
    </RouterLink>
  </nav>
</template>
