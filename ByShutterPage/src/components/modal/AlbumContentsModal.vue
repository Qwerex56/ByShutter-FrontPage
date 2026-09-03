<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';

import { getPhoto } from '@/api/endpoints/photos';
import { getCurrentInstance, onBeforeUpdate, onMounted, ref } from 'vue';
import type { PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto';

const props = defineProps<{
    imageIds?: string[]
}>();

const emits = defineEmits<{
    (e: 'close'): void
}>();

const imageData = ref<PortfolioPhotoDto[]>([]);

const loadImages = async () => {
    if (!props.imageIds) return;

    props.imageIds.forEach(async imageId => {
        const image = await getPhoto(imageId);

        if (!image) return;

        imageData.value.push(image);
    });
}

onMounted(() => {
    loadImages();
    console.log("Album images")
});

onBeforeUpdate(() => {
    imageData.value = []
    loadImages();
    console.log("Album images update")
})
</script>

<template>
    <VueFinalModal class="flex justify-center items-center"
        content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2">
        <section>
            <div>
                Hello World
            </div>
            <div v-for="image in imageData" :key="image.id" class="p-2 bg-jet-black text-white-smoke">
                {{ image.displayName ?? image.fileName }}
            </div>
            <button @click="$emit('close')">
                confirm
            </button>
        </section>
    </VueFinalModal>
</template>