<script setup lang="ts">
const props = defineProps<{
    site: string
}>()
</script>

<template>
    <div class="text-white-smoke">
        <p class="text-[8px] font-light leading-[0.8]">
            <slot name="Action">
                Made by:
            </slot>
        </p>
        <RouterLink :to="props.site" class="text-sm leading-[0.8] font-bold">
            <slot name="AuthorName">John Doe</slot>
        </RouterLink>
    </div>
</template>