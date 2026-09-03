<script setup lang="ts">
import { computed } from 'vue';
import type { 
    PhotoPreviewModel,
    PhotoPreviewEvents
} from './photoPreview.types';

const props = defineProps<PhotoPreviewModel>();
const emit = defineEmits<PhotoPreviewEvents>();

const getImageUrl = computed(() => import.meta.env.VITE_IMAGE_SOURCE_ORIGIN + props.source)
</script>

<template>
<section>
{{ getImageUrl }}
</section>
</template>