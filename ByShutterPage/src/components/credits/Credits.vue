<script setup lang="ts">
const props = defineProps<{
    label: string
    name: string
    detail?: string
    href?: string
}>()
</script>

<template>
    <div class="flex flex-col gap-1 text-white-smoke font-inter">
        <span class="text-[10px] uppercase tracking-widest font-light text-white-smoke/60">
            {{ props.label }}
        </span>

        <a v-if="props.href" :href="props.href" target="_blank" rel="noopener noreferrer"
            class="text-sm font-bold leading-tight hover:text-white-smoke/70 transition-colors duration-100">
            {{ props.name }}
        </a>
        <span v-else class="text-sm font-bold leading-tight">
            {{ props.name }}
        </span>

        <span v-if="props.detail" class="text-xs font-light leading-tight text-white-smoke/70">
            {{ props.detail }}
        </span>
    </div>
</template>
