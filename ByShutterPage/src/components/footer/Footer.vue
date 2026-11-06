<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Credits from '../credits/Credits.vue';

const year = new Date().getFullYear();
</script>

<template>
    <div class="bg-jet-black flex flex-col gap-8 pt-4 pb-4">
        <nav class="flex flex-row flex-wrap gap-4 place-content-center">
            <RouterLink to="/albums"
            class="font-inter text-base underline text-white-smoke hover:text-white-smoke/70 transition-colors duration-100">
                Portfolio
            </RouterLink>

            <RouterLink to="/about-me"
            class="font-inter text-base underline text-white-smoke hover:text-white-smoke/70 transition-colors duration-100">
                About Me
            </RouterLink>

            <RouterLink to="/contact"
            class="font-inter text-base underline text-white-smoke hover:text-white-smoke/70 transition-colors duration-100">
                Contact
            </RouterLink>
        </nav>

        <article>
            <button>
                instagram
            </button>
        </article>

        <article class="flex flex-row flex-wrap items-end justify-between gap-6 border-t border-white-smoke/15 pt-4">
            <div class="flex flex-row flex-wrap gap-8">
                <Credits label="Autor strony" name="Adrian Czubaty" />
                <Credits label="Zdjęcia" name="ByShutter" detail="Piotr Koszałkowski" />
            </div>

            <p class="font-inter text-xs font-light text-white-smoke/50">
                © {{ year }} ByShutter
            </p>
        </article>
    </div>
</template>
