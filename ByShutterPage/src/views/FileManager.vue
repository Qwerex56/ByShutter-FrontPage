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
</script>

<template>
    <section class="text-jet-black p-2">
        <h1 class="text-4xl font-playfair-display font-black">
            Server Files
        </h1>

        <article class="">
            <section class="">
                <h2 class="font-playfair-display font-bold text-3xl mb-2">
                    Upload file
                </h2>

                <MultifileUploader @upload-files="e => mediaStore.uploadFiles(e)" />
            </section>

            <article class="flex flex-col gap-2">
                <h2 class="font-playfair-display font-bold text-3xl">
                    Files:
                </h2>
                <section class="flex flex-row flex-wrap gap-2">
                    <AdminPhotoPreview v-for="image in mediaStore.getMediaFiles()" :key="image.id" :id="image.id"
                        :name="image.fileName" :display-name="image.displayName" :description="image.description"
                        :source="image.serverPath" :image-alt="image.imageAlt" @edit="openImageEdit(image)"
                        @delete="mediaStore.deleteFile(image.id)" class="w-48" />
                </section>

                <button @click="mediaStore.loadFiles" class="bg-jet-black font-bold text-bone self-center px-4 py-2">
                    Load More
                </button>
            </article>
        </article>
    </section>
</template>