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
    <form @submit.prevent="handleAlbumUpload">
        <div>
            <label for="name">Enter name:</label>
            <input type="text" name="name" v-model="name">
            <span>{{ form.errors.value.name }}</span>
        </div>

        <div>
            <label for="description">Enter description:</label>
            <input type="text" name="description" v-model="description">
            <span>{{ form.errors.value.description }}</span>
        </div>

        <button type="submit">
            Create Album
        </button>
    </form>
</template>