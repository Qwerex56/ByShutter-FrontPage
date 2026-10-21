<script setup lang="ts">
import type { AlbumDto } from '@/api/dto/album/albumDto'
import type { PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto'
import { getAlbum } from '@/api/endpoints/albums'
import { getPhoto } from '@/api/endpoints/photos'
import { getMediaUrlPath } from '@/utils/mediaUtils'
import { onMounted, ref } from 'vue'

const props = defineProps<{ id: string }>()
const album = ref<AlbumDto>()
const photos = ref<PortfolioPhotoDto[]>([])
const isLoading = ref(true)
const isFail = ref(false)

onMounted(async () => {
  try {
    const response = await getAlbum(props.id)
    album.value = response.data
    photos.value = (await Promise.all((album.value.photos ?? []).map(photo => getPhoto(photo.photoId)))).filter(Boolean)
  } catch {
    isFail.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <p v-if="isLoading" class="flex min-h-dvh items-center justify-center bg-white-smoke font-playfair-display text-4xl">
    Loading album...</p>
  <p v-else-if="isFail"
    class="flex min-h-dvh items-center justify-center bg-white-smoke font-playfair-display text-4xl">Could not download
    album.</p>
  <main v-else class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 text-jet-black md:px-10 lg:px-16">
    <RouterLink to="/albums"
      class="mb-8 inline-block border-b-2 border-jet-black pb-1 font-playfair-display text-xl font-bold uppercase underline underline-offset-4 hover:text-olive-wood">
      Back to albums</RouterLink>
    <header class="mb-12 max-w-5xl border-b-2 border-jet-black pb-8">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">Selected story</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none md:text-8xl">{{ album?.name }}</h1>
      <p class="mt-5 max-w-[60ch] font-inter font-light leading-relaxed">{{ album?.description }}</p>
    </header>
    <section class="grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <figure v-for="photo in photos" :key="photo.id" class="bg-jet-black">
        <img :src="getMediaUrlPath(photo.fileName)" :alt="photo.imageAlt"
          class="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
        <figcaption v-if="photo.displayName || photo.description" class="p-3 text-white-smoke">
          <p class="font-playfair-display text-xl font-bold">{{ photo.displayName }}</p>
          <p class="mt-1 font-inter text-sm font-light text-white-smoke/75">{{ photo.description }}</p>
        </figcaption>
      </figure>
    </section>
  </main>
</template>
