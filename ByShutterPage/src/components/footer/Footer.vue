<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Credits from '../credits/Credits.vue';


</script>

<template>
    <div class="bg-jet-black flex flex-col gap-8 pt-4">
        <article class="flex flex-row gap-4 place-content-center">
            <RouterLink to="" 
            class="font-inter text-base underline text-white-smoke hover:text-white-smoke/70 transition-colors duration-100">
                Portfolio
            </RouterLink>
            
            <RouterLink to="" 
            class="font-inter text-base underline text-white-smoke hover:text-white-smoke/70 transition-colors duration-100">
                About Me
            </RouterLink>

            <RouterLink to="" 
            class="font-inter text-base underline text-white-smoke hover:text-white-smoke/70 transition-colors duration-100">
                Contact
            </RouterLink>
        </article>

        <article>
            <button>
                instagram
            </button>
        </article>

        <article class="flex flex-row gap-6">
            <Credits :site="'xd'">

            </Credits>

            <Credits :site="'xd'">

            </Credits>
        </article>
    </div>
</template>