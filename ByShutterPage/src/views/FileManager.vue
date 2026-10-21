<script setup lang="ts">
import type { PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto';
import { onMounted, ref } from 'vue';
import { useModal } from 'vue-final-modal';
import AdminPhotoPreview from '@/components/photo_preview/AdminPhotoPreview.vue';
import { useMediaStore } from '@/stores/MediaStore/mediaStore';
import MediaEditModal from '@/components/media_edit_modal/MediaEditModal.vue';
import MultifileUploader from '@/components/image_uploader/MultifileUploader.vue';

const mediaStore = useMediaStore();

const openImageEdit = (image: PortfolioPhotoDto) => {
  const { open, close } = useModal({
    component: MediaEditModal,
    attrs: {
      displayName: image.displayName ?? image.fileName,
      description: image.description ?? '',
      mediaAlt: image.imageAlt,
      mediaSource: image.serverPath,

      onClose() {
        close();
      },

      async onSaveChanges(modifiedMedia) {
        await mediaStore.updateFile(image.id, modifiedMedia)
      },

      async onDeleteMedia() {
        await mediaStore.deleteFile(image.id);

        close();
      }
    }
  });

  open();
}

onMounted(() => {
  mediaStore.loadFiles();
});

const selectedFiles = ref<String[]>([]);

const isFileSelected = (fileId: String) => selectedFiles.value.includes(fileId);

const toggleSelection = (fileId: string) => {
  console.log(selectedFiles)
  if (isFileSelected(fileId)) {
    selectedFiles.value = selectedFiles.value.filter(f => f !== fileId);
  } else {
    selectedFiles.value.push(fileId)
  }
}
</script>

<template>
  <article class="min-h-dvh bg-white-smoke px-4 pb-16 pt-28 text-jet-black md:px-10 lg:px-16">
    <RouterLink :to="{ name: 'config' }"
      class="mb-8 inline-block border-b-2 border-jet-black pb-1 font-playfair-display text-xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood">
      Back to site configuration
    </RouterLink>

    <header class="mb-12 max-w-5xl border-b-2 border-jet-black pb-6">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">Behind the scenes</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none md:text-8xl">
        Server files
      </h1>
    </header>

    <section class="mb-16 max-w-6xl">
      <div class="mb-6 border-b-2 border-jet-black pb-2">
        <h2 class="font-playfair-display text-4xl font-black uppercase md:text-5xl">
          Upload file
        </h2>
      </div>

      <MultifileUploader @upload-files="e => mediaStore.uploadFiles(e)" />
    </section>

    <section class="max-w-6xl">
      <div class="mb-6 flex items-end justify-between gap-4 border-b-2 border-jet-black pb-2">
        <h2 class="font-playfair-display text-5xl font-black uppercase md:text-6xl">
          Files
        </h2>
        <span class="font-rouge-script text-3xl text-olive-wood md:text-4xl">The archive</span>
      </div>

      <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AdminPhotoPreview v-for="image in mediaStore.getMediaFiles()" :key="image.id" :id="image.id"
          :name="image.fileName" :display-name="image.displayName" :description="image.description"
          :source="image.serverPath" :image-alt="image.imageAlt" :is-selcted="isFileSelected(image.id)"
          @edit="openImageEdit(image)" @delete="mediaStore.deleteFile(image.id)" @select="toggleSelection" />
      </section>

      <button @click="mediaStore.loadFiles"
        class="mt-8 border-b-2 border-jet-black px-2 pb-1 font-playfair-display text-2xl font-bold uppercase underline underline-offset-4 transition-colors hover:text-olive-wood">
        Load more
      </button>
    </section>
  </article>
</template>
