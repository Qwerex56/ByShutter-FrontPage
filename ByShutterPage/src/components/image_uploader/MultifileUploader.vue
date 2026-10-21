<script setup lang="ts">
import type { MediaUploadFormModel } from '@/types/mediaUploadFormModel';
import { ref } from 'vue';
import type { ImageUploaderEvents } from './imageUploaderForm.types';

const emit = defineEmits<ImageUploaderEvents>();

const mediaFiles = ref<MediaUploadFormModel[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFilesChange = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (!target.files || target.files.length === 0) {
    mediaFiles.value = [];
    return;
  }

  // Build a set of file names currently selected in the input
  const selectedNames = new Set<string>();
  for (let i = 0; i < target.files.length; i++) {
    const f = target.files[i];
    if (f) selectedNames.add(f.name);
  }

  // Remove mediaFiles entries that are not present in the input anymore
  mediaFiles.value = mediaFiles.value.filter(mf => selectedNames.has(mf.file.name));

  // Add new files that are in the input but not yet in mediaFiles
  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i];
    if (!file) continue;

    const exists = mediaFiles.value.some(mf => mf.file.name === file.name);
    if (exists) continue; // skip existing

    const mediaFile: MediaUploadFormModel = {
      file: file,
      displayName: file.name,
      mediaAlt: "",
      description: ""
    };

    mediaFiles.value.push(mediaFile);
  }
}

const handleFileRemoval = (e: Event, fileName: string) => {
  e.preventDefault();

  // Remove from local state
  mediaFiles.value = mediaFiles.value.filter(mf => mf.file.name !== fileName);

  // Update the underlying input's FileList by creating a new DataTransfer
  const input = fileInput.value;
  if (!input) return;

  const dt = new DataTransfer();
  const files = input.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (f && f.name !== fileName) {
      dt.items.add(f);
    }
  }

  input.files = dt.files;
}

const handleFilesSubmit = () => {
  emit('uploadFiles', mediaFiles.value);
}
</script>

<template>
  <form @submit.prevent="handleFilesSubmit"
    class="flex flex-col gap-6 bg-jet-black p-4 font-inter text-white-smoke md:p-6">
    <div class="flex flex-col gap-2">
      <label class="font-playfair-display text-2xl font-bold uppercase">
        Select files to upload
      </label>
      <input ref="fileInput" type="file" name="multifile" multiple id="" @change="handleFilesChange"
        class="w-full text-sm file:mr-3 file:border-0 file:bg-bone file:px-3 file:py-2 file:font-inter file:font-bold file:text-jet-black file:uppercase file:transition-colors hover:file:bg-olive-wood hover:file:text-white-smoke">
    </div>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="file in mediaFiles" :key="file.file.name"
        class="group flex min-w-0 flex-col gap-4 bg-bone p-3 text-base font-medium text-jet-black">
        <div class="flex flex-col gap-2">
          <div class="flex w-full items-start justify-between gap-2">
            <p class="overflow-hidden text-ellipsis font-playfair-display text-xl font-bold leading-tight">
              {{ file.file.name }}
            </p>
            <button type="button" aria-label="Remove file" @click.prevent="handleFileRemoval($event, file.file.name)"
              class="shrink-0 border-b border-jet-black px-1 font-playfair-display text-xl font-bold leading-none hover:text-red-700">
              x
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="" class="font-playfair-display font-bold uppercase">File name</label>
          <input required type="text" name="" v-model="file.displayName"
            class="border-b border-jet-black bg-transparent px-1 py-1 text-sm font-normal outline-none focus:border-olive-wood">
        </div>

        <div class="flex flex-col gap-1">
          <label for="" class="font-playfair-display font-bold uppercase">Media alternative text</label>
          <input required type="text" name="" v-model="file.mediaAlt"
            class="border-b border-jet-black bg-transparent px-1 py-1 text-sm font-normal outline-none focus:border-olive-wood"
            placeholder="Media alternative text">
        </div>

        <div class="flex flex-col gap-1">
          <label for="" class="font-playfair-display font-bold uppercase">Media description (optional)</label>
          <textarea type="text" name="" v-model="file.description"
            class="min-h-20 resize-y border-b border-jet-black bg-transparent px-1 py-1 text-sm font-normal outline-none focus:border-olive-wood"
            placeholder="Example media description"></textarea>
        </div>
      </div>
    </section>

    <button v-if="mediaFiles.length > 0" type="submit"
      class="self-start bg-bone px-5 py-2 font-playfair-display text-2xl font-bold uppercase text-jet-black underline decoration-1 underline-offset-4 transition-colors hover:bg-olive-wood hover:text-white-smoke">
      Upload files
    </button>
  </form>
</template>
