<script setup lang="ts">
import type { AlbumDto } from '@/api/dto/album/albumDto';
import { addImagesToAlbum, getAlbum } from '@/api/endpoints/albums';
import AddPhotosToAlbumModal from '@/components/add_photos_to_album_modal/AddPhotosToAlbumModal.vue';
import AdminPhotoPreview from '@/components/photo_preview/AdminPhotoPreview.vue';
import { useAdminPhotoPreview } from '@/components/photo_preview/useAdminPhotoPreview';
import { getMediaUrlPath } from '@/utils/mediaUtils';
import { ref, watchEffect } from 'vue';
import { useModal } from 'vue-final-modal';

const props = defineProps<{
  id: string
}>();

const album = ref<AlbumDto | null>(null);
const isLoadingSite = ref(true);
const isFail = ref(false);

const { media, isLoading, hasMore, page, prevPage, nextPage } = useAdminPhotoPreview(props.id);

const openAddPhotos = (albumId: string) => {
  const { open, close } = useModal({
    component: AddPhotosToAlbumModal,
    attrs: {
      albumId: albumId,

      onClose: () => {
        close()
      },

      onSaveChanges: async (payload: string[]) => {
        const result = await addImagesToAlbum(albumId, { imageIds: payload })

        console.log(result.status);
        return;
      }
    }
  })

  open()
}

watchEffect(async () => {
  isLoadingSite.value = true;

  const response = await getAlbum(props.id);
  console.log(response);
  isLoadingSite.value = false;

  if (response.status !== 200) {
    isFail.value = true;

    return;
  }

  isFail.value = false;
  album.value = response.data;
});

</script>

<template>
  <p v-if="isLoadingSite"
    class="flex min-h-dvh items-center justify-center bg-white-smoke px-4 font-playfair-display text-4xl font-bold text-jet-black">
    Loading album...
  </p>

  <p v-else-if="isFail"
    class="flex min-h-dvh items-center justify-center bg-white-smoke px-4 font-playfair-display text-4xl font-bold text-jet-black">
    Could not download album
  </p>

  <article v-else class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 md:px-10 lg:px-16">
    <RouterLink :to="{ name: 'Albums' }"
      class="mb-8 inline-block border-b-2 border-jet-black pb-1 font-playfair-display text-xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood">
      Back to albums
    </RouterLink>

    <header class="mb-12 max-w-5xl border-b-2 border-jet-black pb-6">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">Album details</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none text-jet-black md:text-8xl">
        {{ album?.name }}
      </h1>

      <p class="mt-5 max-w-[60ch] font-inter text-base font-light leading-relaxed text-jet-black/80">
        {{ album?.description }}
      </p>
    </header>

    <section class="max-w-6xl">
      <div
        class="mb-6 flex flex-col gap-4 border-b-2 border-jet-black pb-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="font-playfair-display text-5xl font-black uppercase text-jet-black md:text-6xl">
          Photos
        </h2>

        <button @click="openAddPhotos(id)"
          class="w-fit bg-jet-black px-4 py-2 font-playfair-display text-xl font-bold uppercase text-white-smoke underline decoration-1 underline-offset-4 transition-colors hover:bg-olive-wood">
          Add photos
        </button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AdminPhotoPreview v-for="photo in media" :key="photo.id" :id="photo.id" :name="photo.fileName"
          :display-name="photo.displayName" :description="photo.description" :image-alt="photo.imageAlt"
          :source="getMediaUrlPath(photo.fileName)" />
      </div>

      <div class="mt-8 flex items-center gap-4 border-t-2 border-jet-black pt-4 font-inter">
        <button v-if="page != 0" @click="prevPage" :disabled="isLoading"
          class="border-b-2 border-jet-black px-2 pb-1 font-playfair-display text-xl font-bold uppercase underline underline-offset-4 transition-colors hover:text-olive-wood disabled:opacity-40">
          Previous
        </button>
        <p class="font-playfair-display text-2xl font-bold text-jet-black">
          {{ page }}
        </p>
        <button v-if="hasMore" @click="nextPage" :disabled="isLoading"
          class="border-b-2 border-jet-black px-2 pb-1 font-playfair-display text-xl font-bold uppercase underline underline-offset-4 transition-colors hover:text-olive-wood disabled:opacity-40">
          Next
        </button>
      </div>
    </section>
  </article>
</template>
