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
  <p v-if="isLoadingSite">
    Data is being loaded
  </p>

  <p v-else-if="isFail">
    Could not download data
  </p>

  <article v-else>
    <h1>
      {{ album?.name }}
    </h1>

    <h3>
      {{ album?.description }}
    </h3>

    <section>
      <p>
        Photos
      </p>

      <button @click="openAddPhotos(id)">
        Add photos
      </button>

      <AdminPhotoPreview v-for="photo in media" :key="photo.id" :id="photo.id" :name="photo.fileName"
        :display-name="photo.displayName" :description="photo.description" :image-alt="photo.imageAlt"
        :source="getMediaUrlPath(photo.fileName)">

      </AdminPhotoPreview>

      <div class="flex flex-row">
        <button v-if="page != 0" @click="">
          Previous page
        </button>
        <p>
          {{ page }}
        </p>
        <button v-if="hasMore" @click="">
          Next page
        </button>
      </div>
    </section>
  </article>
</template>
