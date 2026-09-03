<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    cover: string,
    alt: string
}>();

const getRandomRotation = computed(() => {
    return Math.floor((Math.random() - 0.5) * 12);
});
</script>

<template>
    <div class="grid grid-cols-1 grid-rows-1 relative size-40">
        <div class="absolute w-40 h-40 top-0 left-0 hover:animate-shuffle fill-animation z-10 bg-red-500"></div>
        <div class="absolute w-40 h-40 top-0 left-0 bg-green-500"></div>
        <div class="absolute w-40 h-40 top-0 left-0 bg-blue-500"></div>

        <!-- <img class="border-4 absolute top-0 left-0 hover:animate-shuffle z-10" :class="'rotate-['+getRandomRotation+'deg]'" :src="props.cover" :alt="props.alt" />
        <img class="border-4 absolute top-0 left-0" :class="'rotate-['+getRandomRotation+'deg]'" :src="props.cover" :alt="props.alt" />
        <img class="border-4 absolute top-0 left-0" :class="'rotate-['+getRandomRotation+'deg]'" :src="props.cover" :alt="props.alt" /> -->
    </div>
</template>

<style lang="css" scoped>
.fill-animation {
    animation-fill-mode: forwards;
}
</style>