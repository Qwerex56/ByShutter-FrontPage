<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { useAddPhotosToAlbum } from './useAddPhotosToAlbum';
import { type AddPhotosToAlbumEvents, type AddPhotosToAlbumModel } from './addPhotosToAlbum.types';
import { onMounted, ref } from 'vue';

const params = defineProps<AddPhotosToAlbumModel>();
const emits = defineEmits<AddPhotosToAlbumEvents>();

const imagesToAdd = ref<string[]>([])

const isImageAdded = (imageId: string) => {
  return imagesToAdd.value.includes(imageId)
}

const {
  media,
  isLoading,
  hasMore,
  nextPage
} = useAddPhotosToAlbum(params.albumId);

onMounted(() => {
  nextPage()
})

const handleLoadFiles = () => {
  nextPage()
}

const handleClose = () => {
  emits('close');
}

const handleSave = () => {
  emits('saveChanges', imagesToAdd.value);
}

const handleImageToggle = (imageId: string) => {
  const isAdded = isImageAdded(imageId);

  if (!isAdded) {
    imagesToAdd.value.push(imageId);
    return;
  }

  imagesToAdd.value = imagesToAdd.value.filter(id => id !== imageId);
}
</script>

<template>
  <VueFinalModal class="max-h-[90vh] w-[min(96vw,1100px)] overflow-y-auto bg-white-smoke p-4 shadow-2xl md:p-8">
    <div class="mb-6 flex flex-col gap-4 border-b-2 border-jet-black pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-rouge-script text-4xl leading-none text-olive-wood">Build your story</p>
        <h1 class="font-playfair-display text-4xl font-black uppercase leading-none text-jet-black md:text-6xl">
          Select photos to add to album
        </h1>
      </div>

      <div class="flex gap-2">
        <button @click="handleClose"
          class="border-b-2 border-jet-black px-2 py-1 font-playfair-display text-xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood">
          Close
        </button>
        <button @click="handleSave"
          class="bg-jet-black px-4 py-2 font-playfair-display text-xl font-bold uppercase text-white-smoke underline decoration-1 underline-offset-4 transition-colors hover:bg-olive-wood">
          Save changes
        </button>
      </div>
    </div>

    <section class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <div v-for="photo in media" :key="photo.id">
        <button @click="handleImageToggle(photo.id)"
          class="group relative flex h-full w-full flex-col bg-bone p-2 text-left font-inter text-jet-black transition-transform duration-200 hover:-translate-y-1"
          :class="isImageAdded(photo.id) ? 'ring-4 ring-olive-wood' : ''">
          <div class="absolute right-2 top-2 z-10 h-4 w-4 rounded-full border-2 border-white-smoke shadow"
            :class="isImageAdded(photo.id) ? 'bg-olive-wood' : 'bg-jet-black/40'">
          </div>

          <img :src="photo.serverPath" :alt="photo.imageAlt"
            class="mb-2 aspect-square w-full object-cover transition-opacity group-hover:opacity-80">

          <p class="mt-auto text-sm font-semibold leading-tight">
            {{ photo.displayName ?? photo.fileName }}
          </p>
        </button>
      </div>
    </section>

    <button v-if="hasMore" @click="handleLoadFiles" :disabled="isLoading"
      class="mt-6 border-b-2 border-jet-black px-2 pb-1 font-playfair-display text-2xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood disabled:cursor-wait disabled:opacity-50">
      {{ isLoading ? 'Loading...' : 'Load more' }}
    </button>
  </VueFinalModal>
</template>
