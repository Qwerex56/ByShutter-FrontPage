<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { MediaEditModel } from './mediaEditModal.types';
import type { MediaEditForm } from '@/types/mediaEditForm';
import { ref } from 'vue';

const props = defineProps<MediaEditModel>();
const isImageExpanded = ref(false);

const mediaEditValidatorSchema = z.object({
  displayName: z.string().min(3).max(32),
  description: z.string().min(0).max(256),
  mediaAlt: z.string().min(3).max(32)
});

const { errors, handleSubmit, defineField } = useForm<MediaEditForm>({
  validationSchema: toTypedSchema(mediaEditValidatorSchema),
  initialValues: {
    displayName: props.displayName,
    description: props.description,
    mediaAlt: props.mediaAlt
  }
});

const [displayName] = defineField('displayName');
const [description] = defineField('description');
const [mediaAlt] = defineField('mediaAlt');

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'saveChanges', media: MediaEditForm): void
  (e: 'deleteMedia'): void
}>();

const handleFormSubmit = handleSubmit((values) => {
  emits('saveChanges', values);
})

const handleFormClose = () => {
  emits('close');
}

const handleMediaDelete = () => {
  const confirm = window.confirm('Do you really want to delete this image?');

  if (confirm) {
    emits('deleteMedia');
  }
}
</script>

<template>
  <VueFinalModal class="flex items-center justify-center bg-jet-black/70 p-4 backdrop-blur-sm">
    <section v-if="isImageExpanded" class="relative flex h-full w-full items-center justify-center">
      <img :src="mediaSource" :alt="mediaAlt" class="max-h-[calc(100dvh-2rem)] max-w-full object-contain"
        @click="isImageExpanded = false">
      <button type="button" aria-label="Return to media editing" @click="isImageExpanded = false"
        class="absolute right-0 top-0 bg-white-smoke px-4 py-2 font-playfair-display text-xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:bg-olive-wood hover:text-white-smoke">
        Back to edit
      </button>
    </section>

    <template v-else>
      <section class="w-full max-w-2xl bg-white-smoke p-4 shadow-2xl md:p-8">
        <header class="mb-6 border-b-2 border-jet-black pb-4">
          <p class="font-rouge-script text-4xl leading-none text-olive-wood">Refine the frame</p>
          <h1 class="font-playfair-display text-4xl font-black uppercase leading-none text-jet-black md:text-5xl">
            Edit media
          </h1>
        </header>

        <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_12rem]">
          <div class="flex flex-col gap-5 font-inter">
            <label class="flex flex-col gap-2 font-playfair-display text-lg font-bold uppercase text-jet-black">
              Display name
              <input type="text" v-model="displayName"
                class="border-b-2 border-jet-black bg-transparent px-2 py-2 font-inter text-base font-normal outline-none focus:border-olive-wood">
            </label>
            <span class="-mt-4 text-sm text-red-700" v-if="errors.displayName">{{ errors.displayName }}</span>

            <label class="flex flex-col gap-2 font-playfair-display text-lg font-bold uppercase text-jet-black">
              Alternative text
              <input type="text" v-model="mediaAlt"
                class="border-b-2 border-jet-black bg-transparent px-2 py-2 font-inter text-base font-normal outline-none focus:border-olive-wood">
            </label>
            <span class="-mt-4 text-sm text-red-700" v-if="errors.mediaAlt">{{ errors.mediaAlt }}</span>

            <label class="flex flex-col gap-2 font-playfair-display text-lg font-bold uppercase text-jet-black">
              Description
              <textarea v-model="description"
                class="min-h-32 resize-y border-b-2 border-jet-black bg-transparent px-2 py-2 font-inter text-base font-normal outline-none focus:border-olive-wood"></textarea>
            </label>
            <span class="-mt-4 text-sm text-red-700" v-if="errors.description">{{ errors.description }}</span>
          </div>

          <button type="button" aria-label="View image in full" @click="isImageExpanded = true"
            class="group relative block h-fit w-full cursor-zoom-in self-start bg-jet-black p-2">
            <img :src="mediaSource" :alt="mediaAlt"
              class="aspect-square w-full object-cover transition-opacity duration-200 group-hover:opacity-80">
            <span
              class="absolute bottom-4 left-4 bg-white-smoke px-2 py-1 font-playfair-display text-sm font-bold uppercase text-jet-black">
              View full image
            </span>
          </button>
        </div>
      </section>

      <section class="flex w-full max-w-2xl flex-col gap-2 bg-white-smoke px-4 pb-4 md:flex-row md:px-8 md:pb-8">
        <button
          class="w-full bg-jet-black px-4 py-2 font-playfair-display text-xl font-bold uppercase text-white-smoke underline underline-offset-4 transition-colors hover:bg-olive-wood"
          @click="handleFormSubmit">
          Save changes
        </button>
        <button
          class="w-full border-b-2 border-jet-black px-4 py-2 font-playfair-display text-xl font-bold uppercase text-jet-black underline underline-offset-4 transition-colors hover:text-olive-wood"
          @click="handleFormClose">
          Close
        </button>
        <button
          class="w-full bg-red-700 px-4 py-2 font-playfair-display text-xl font-bold uppercase text-white-smoke underline underline-offset-4 transition-colors hover:bg-red-900"
          @click="handleMediaDelete">
          Delete image
        </button>
      </section>
    </template>
  </VueFinalModal>
</template>
