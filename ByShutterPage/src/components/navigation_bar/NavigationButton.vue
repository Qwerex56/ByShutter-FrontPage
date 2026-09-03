<script setup lang="ts">
const params = defineProps<{
    to: string
}>();
</script>

<template>
    <RouterLink :to="to" class="hover:bg-olive-wood py-1 px-2 rounded-sm">
        <slot>

        </slot>
    </RouterLink>
</template>