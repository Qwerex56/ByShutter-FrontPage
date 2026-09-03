<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { useAddPhotosToAlbum } from './useAddPhotosToAlbum';
import { type AddPhotosToAlbumEvents, type AddPhotosToAlbumModel } from './addPhotosToAlbum.types';
import { computed, onMounted, ref } from 'vue';

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
  <VueFinalModal class="bg-white">
    <h1>
      Select photos to add to album
    </h1>

    <div>
      <button @click="handleSave">
        Save Changes
      </button>
    </div>

    <section class="grid grid-cols-6 gap-0.5 justify-stretch items-stretch">
      <div v-for="photo in media" :key="photo.id">
        <button @click="handleImageToggle(photo.id)"
          class="flex relative flex-col bg-bone w-full h-full p-1 text-ellipsis text-jet-black font-inter">
          <div class="absolute min-w-4 min-h-4 rounded-full"
            :class="isImageAdded(photo.id) ? 'bg-green-400' : 'bg-red-400'">
          </div>

          <img :src="photo.serverPath" :alt="photo.imageAlt" class="mb-2">

          <p class="text-xs">
            {{ photo.displayName ?? photo.fileName }}
          </p>
        </button>
      </div>
    </section>

    <button v-if="hasMore" @click="handleLoadFiles">
      Load more
    </button>
  </VueFinalModal>
</template>
