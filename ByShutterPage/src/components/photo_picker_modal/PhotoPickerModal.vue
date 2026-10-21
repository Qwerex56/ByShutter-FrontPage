<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { getPhotos } from '@/api/endpoints/photos'
import type { PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto'

defineProps<{ title: string; selectedId?: string }>()
const emit = defineEmits<{ (event: 'close'): void; (event: 'select', photo: PortfolioPhotoDto): void }>()
const photos = ref<PortfolioPhotoDto[]>([])
const page = ref(0)
const isLoading = ref(false)
const hasMore = ref(true)

async function loadMore() {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  try {
    const next = await getPhotos(12, page.value)
    photos.value.push(...next)
    page.value += 1
    hasMore.value = next.length === 12
  } finally {
    isLoading.value = false
  }
}

onMounted(loadMore)
</script>

<template>
  <VueFinalModal class="flex items-center justify-center bg-jet-black/70 p-4 backdrop-blur-sm">
    <section class="max-h-[90dvh] w-full max-w-5xl overflow-y-auto bg-white-smoke p-5 md:p-8">
      <header class="mb-6 flex items-end justify-between border-b-2 border-jet-black pb-4">
        <h2 class="font-playfair-display text-4xl font-black uppercase">{{ title }}</h2>
        <button type="button" class="admin-button" @click="emit('close')">Close</button>
      </header>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button v-for="photo in photos" :key="photo.id" type="button"
          class="group border-2 p-2 text-left transition-colors hover:border-olive-wood"
          :class="photo.id === selectedId ? 'border-olive-wood bg-bone' : 'border-transparent bg-jet-black'"
          @click="emit('select', photo)">
          <img :src="photo.serverPath" :alt="photo.imageAlt" class="aspect-square w-full object-cover" />
          <span class="mt-2 block truncate font-inter text-xs text-white-smoke group-hover:text-bone">{{
            photo.displayName || photo.fileName }}</span>
        </button>
      </div>
      <button v-if="hasMore" type="button" class="admin-button mt-6 border-2 border-jet-black" :disabled="isLoading"
        @click="loadMore">Load more</button>
      <p v-else class="mt-6 font-inter text-sm">No more photos.</p>
    </section>
  </VueFinalModal>
</template>
