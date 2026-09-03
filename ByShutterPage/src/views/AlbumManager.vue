<script setup lang="ts">
import type { AlbumUploadForm } from '@/components/album_upload/albumUpload.types';
import AlbumUpload from '@/components/album_upload/AlbumUpload.vue';
import { useAlbumStore } from '@/stores/albumStore/albumStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const albumStore = useAlbumStore();
const router = useRouter();

onMounted(() => {
    albumStore.loadAlbums();
});

const handleAlbumUpload = (payload: AlbumUploadForm) => {
    console.log(payload);
}

const handleLoadMore = (e: Event) => {
    albumStore.loadAlbums();
}
</script>

<template>
    <article>
        <h1>
            Album Manager
        </h1>

        <section>
            <h2>
                Create new album
            </h2>

            <AlbumUpload @upload-album="handleAlbumUpload" />
        </section>

        <section>
            <h1>
                Albums
            </h1>

            <div class="flex flex-row flex-wrap gap-1 font-inter">
                <div v-for="album in albumStore.getAlbumsPage()" :key="album.id"
                    class="flex flex-col basis-36 flex-1 bg-jet-black p-2 gap-4">
                    <div class="text-white-smoke">
                        <p class="font-bold">{{ album.name }}</p>
                        <p class="text-xs">{{ album.description }}</p>
                    </div>

                    <RouterLink :to="{ name: 'AdminAlbumView', params: { id: album.id } }"
                        class="bg-bone px-0.5 py-1 justify-self-end">
                        Open album
                    </RouterLink>
                </div>
            </div>

            <button @click="handleLoadMore">
                Load more
            </button>
        </section>
    </article>
</template>