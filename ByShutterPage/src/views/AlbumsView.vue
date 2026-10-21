<script setup lang="ts">
import type { AlbumDto } from '@/api/dto/album/albumDto'
import { getAlbums } from '@/api/endpoints/albums'
import { getPhoto } from '@/api/endpoints/photos'
import { getMediaUrlPath } from '@/utils/mediaUtils'
import { onMounted, ref } from 'vue'

const albums = ref<AlbumDto[]>([])
const coverUrls = ref<Record<string, string>>({})
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await getAlbums(50, 0)
    albums.value = response.data
    const covers = await Promise.all(albums.value.map(async (album) => {
      const photoId = album.photos?.[0]?.photoId
      if (!photoId) return [album.id, ''] as const
      const photo = await getPhoto(photoId)
      return [album.id, getMediaUrlPath(photo.fileName)] as const
    }))
    coverUrls.value = Object.fromEntries(covers)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 text-jet-black md:px-10 lg:px-16">
    <header class="mb-14 max-w-5xl border-b-2 border-jet-black pb-8">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">A moving archive</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none md:text-8xl">Albums</h1>
      <p class="mt-6 max-w-[52ch] font-inter font-light leading-relaxed">Samochody, detale i drogi zapisane w osobnych
        historiach.</p>
    </header>

    <p v-if="isLoading" class="font-playfair-display text-3xl">Loading albums...</p>
    <p v-else-if="!albums.length" class="font-playfair-display text-3xl">No albums yet.</p>
    <section v-else class="grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink v-for="(album, index) in albums" :key="album.id"
        :to="{ name: 'PublicAlbum', params: { id: album.id } }"
        class="group bg-bone transition-transform duration-200 hover:-translate-y-1">
        <div class="aspect-[4/3] overflow-hidden bg-jet-black">
          <img v-if="coverUrls[album.id]" :src="coverUrls[album.id]" :alt="album.name ?? 'Album cover'"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div v-else class="flex h-full items-center justify-center font-rouge-script text-4xl text-bone">No cover
          </div>
        </div>
        <div class="flex items-end justify-between gap-4 p-4">
          <div>
            <p class="font-rouge-script text-3xl text-olive-wood">0{{ index + 1 }}</p>
            <h2 class="font-playfair-display text-3xl font-black uppercase leading-none">{{ album.name }}</h2>
            <p class="mt-2 font-inter text-sm font-light">{{ album.description }}</p>
          </div>
          <span class="font-playfair-display text-2xl font-bold underline">Open</span>
        </div>
      </RouterLink>
    </section>
  </main>
</template>
