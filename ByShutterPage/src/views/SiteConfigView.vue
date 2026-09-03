<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="flex flex-col gap-4 p-4 text-jet-black">
        <article>
            <h1 class="font-playfair-display text-5xl">
                Configure Site
            </h1>
        </article>

        <article class="flex flex-row gap-4 p-4">
            <RouterLink to="/config/files"
                class="px-4 py-2 text-xl text-center font-inter font-bold text-jet-black bg-bone rounded hover:underline">
                Manage Files
            </RouterLink>

            <RouterLink to="/config/albums"
                class="px-4 py-2 text-xl text-center font-inter font-bold text-jet-black bg-bone rounded hover:underline">
                Manage Albums
            </RouterLink>

            <RouterLink to="/config/tiles"
                class="px-4 py-2 text-xl text-center font-inter font-bold text-jet-black bg-bone rounded hover:underline">
                Manage Tiles
            </RouterLink>

            <RouterLink to="/config/profiles"
                class="px-4 py-2 text-xl text-center font-inter font-bold text-jet-black bg-bone rounded hover:underline">
                Manage Profiles
            </RouterLink>
        </article>
    </section>
</template>