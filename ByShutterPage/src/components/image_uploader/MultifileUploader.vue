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
class="flex flex-col gap-4 p-2 bg-jet-black">
    <div class="flex flex-col text-white-smoke">
        <label>
            Select files
        </label>
        <input ref="fileInput" type="file" name="multifile" multiple id="" @change="handleFilesChange"
        class="ml-4 file:bg-bone file:text-jet-black file:font-bold file:font-inter file:px-2 file:py-1">
    </div>

    <section class="flex flex-row flex-wrap gap-2">
        <div v-for="file in mediaFiles" :key="file.file.name"
            class="group flex flex-col flex-1 basis-3xs bg-bone 
            text-base text-jet-black font-inter font-medium
            p-1">
            <div>
                <div class="flex flex-row w-full justify-between">
                    <p class="text-xl font-bold">
                        {{ file.file.name }}
                    </p>
                    <button type="button" @click.prevent="handleFileRemoval($event, file.file.name)">
                        x
                    </button>
                </div>
                <img src="" alt="Image Preview" class="text-jet-black">
            </div>

            <div class="flex flex-col">
                <label for="">File name</label>
                <input required type="text" name="" v-model="file.displayName"
                    class="font-normal text-sm ml-4"
                    >
            </div>

            <div class="flex flex-col">
                <label for="">Media alternative text</label>
                <input required type="text" name="" v-model="file.mediaAlt"
                    class="font-normal text-sm ml-4"
                    placeholder="Media alternative text"
                >
            </div>

            <div class="flex flex-col">
                <label for="">Media description (optional)</label>
                <textarea type="text" name="" v-model="file.description"
                    class="font-normal text-sm ml-4"
                    placeholder="Example media description"
                    ></textarea>
            </div>
        </div>
    </section>

    <button v-if="mediaFiles.length > 0" type="submit" class="bg-bone self-center px-4 py-2 font-inter font-black text-xl">
        Upload Files
    </button>
</form>
</template>