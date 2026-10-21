<script setup lang="ts">
import { useForm } from 'vee-validate';
import { type AlbumUploadForm, type AlbumUploadEvents } from './albumUpload.types';
import { toTypedSchema } from '@vee-validate/zod';
import albumUploadSchema from './albumUploadValidatorSchema';

const emit = defineEmits<AlbumUploadEvents>();

const form = useForm<AlbumUploadForm>({
  validationSchema: toTypedSchema(albumUploadSchema),
  initialValues: {
    name: "Album Name",
    description: "Description"
  }
});

const [name] = form.defineField('name');
const [description] = form.defineField('description');

const handleAlbumUpload = form.handleSubmit((values, { resetForm }) => {
  emit('uploadAlbum', values);
  resetForm();
});
</script>

<template>
  <form @submit.prevent="handleAlbumUpload" class="grid gap-5 font-inter md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <label for="name" class="font-playfair-display text-xl font-bold uppercase text-jet-black">Enter name</label>
      <input id="name" type="text" name="name" v-model="name"
        class="border-b-2 border-jet-black bg-transparent px-2 py-2 text-jet-black outline-none transition-colors placeholder:text-olive-wood focus:border-olive-wood">
      <span class="font-inter text-sm text-red-700">{{ form.errors.value.name }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <label for="description" class="font-playfair-display text-xl font-bold uppercase text-jet-black">Enter
        description</label>
      <input id="description" type="text" name="description" v-model="description"
        class="border-b-2 border-jet-black bg-transparent px-2 py-2 text-jet-black outline-none transition-colors placeholder:text-olive-wood focus:border-olive-wood">
      <span class="font-inter text-sm text-red-700">{{ form.errors.value.description }}</span>
    </div>

    <button type="submit"
      class="w-fit bg-jet-black px-5 py-2 font-playfair-display text-2xl font-bold uppercase text-white-smoke underline decoration-1 underline-offset-4 transition-colors hover:bg-olive-wood md:col-span-2">
      Create album
    </button>
  </form>
</template>
