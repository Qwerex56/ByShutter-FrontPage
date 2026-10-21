<script setup lang="ts">
import { createAlbum } from '@/api/endpoints/albums';
import type { AlbumUploadForm } from '@/components/album_upload/albumUpload.types';
import AlbumUpload from '@/components/album_upload/AlbumUpload.vue';
import { useAlbumStore } from '@/stores/albumStore/albumStore';
import { onMounted } from 'vue';
const albumStore = useAlbumStore();

onMounted(() => {
  albumStore.loadAlbums();
});

const handleAlbumUpload = (payload: AlbumUploadForm) => {
  createAlbum(payload)
}

const handleLoadMore = () => {
  albumStore.loadAlbums();
}

const handleAlbumDelete = async (albumId: string, albumName: string) => {
  const confirmed = window.confirm(
    `Do you really want to delete the album "${albumName}"?\nTHIS CAN NOT BE UNDONE`,
  );

  if (!confirmed) {
    return;
  }

  await albumStore.deleteAlbumById(albumId);
}
</script>

<template>
  <article class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 md:px-10 lg:px-16">
    <RouterLink :to="{ name: 'config' }"
      class="mb-8 inline-block border-b-2 border-jet-black pb-1 font-playfair-display text-xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood">
      Back to site configuration
    </RouterLink>

    <header class="mb-12 max-w-5xl">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">
        Your collection
      </p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none text-jet-black md:text-8xl">
        Album Manager
      </h1>
    </header>

    <section class="mb-16 max-w-5xl border-y-2 border-jet-black py-8">
      <h2 class="mb-6 font-playfair-display text-4xl font-black uppercase text-jet-black md:text-5xl">
        Create new album
      </h2>

      <AlbumUpload @upload-album="handleAlbumUpload" />
    </section>

    <section class="max-w-6xl">
      <div class="mb-6 flex items-end justify-between gap-4 border-b-2 border-jet-black pb-2">
        <h2 class="font-playfair-display text-5xl font-black uppercase text-jet-black md:text-6xl">
          Albums
        </h2>
        <span class="font-rouge-script text-3xl text-olive-wood md:text-4xl">Selected works</span>
      </div>

      <div class="grid gap-3 font-inter sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="album in albumStore.getAlbumsPage()" :key="album.id"
          class="group flex min-h-48 flex-col justify-between bg-jet-black p-4 transition-transform duration-200 hover:-translate-y-1">
          <div class="text-white-smoke">
            <p class="font-playfair-display text-3xl font-black leading-tight">{{ album.name }}</p>
            <p class="mt-3 max-w-[38ch] text-sm font-light leading-relaxed text-white-smoke/80">{{ album.description }}
            </p>
          </div>

          <div class="mt-8 flex gap-2">
            <RouterLink :to="{ name: 'AdminAlbumView', params: { id: album.id } }"
              class="flex-1 bg-bone px-3 py-2 text-right font-playfair-display text-2xl font-bold uppercase text-jet-black underline decoration-1 underline-offset-4 transition-colors group-hover:bg-olive-wood group-hover:text-white-smoke">
              Open
            </RouterLink>
            <button type="button" @click="handleAlbumDelete(album.id, album.name ?? 'Untitled album')"
              class="bg-olive-wood px-3 py-2 font-playfair-display text-xl font-bold uppercase text-white-smoke underline decoration-1 underline-offset-4 transition-colors hover:bg-red-800">
              Delete
            </button>
          </div>
        </div>
      </div>

      <button @click="handleLoadMore"
        class="mt-8 border-b-2 border-jet-black px-2 pb-1 font-playfair-display text-3xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood">
        Load more
      </button>
    </section>
  </article>
</template>
