<script setup lang="ts">
const props = defineProps<{
    heroText?: string
}>()
</script>

<template>
<article class="flex items-end bg-[url(/public/ClockImage.png)] bg-no-repeat bg-cover bg-center h-dvh">
    <p class="text-8xl text-white m-8 contras font-rouge-script">
        {{ heroText ?? 'Hello not there' }}
    </p>
</article>
</template>