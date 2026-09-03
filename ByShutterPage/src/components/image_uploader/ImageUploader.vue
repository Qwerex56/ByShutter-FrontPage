<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod'
import type { MediaUploadFormModel } from '../../types/mediaUploadFormModel';
import imageUploadSchema from './imageUploadFormValidatorSchema';
import type { ImageUploaderEvents } from './imageUploaderForm.types';

const emit = defineEmits<ImageUploaderEvents>();

const { errors, handleSubmit, setFieldValue, defineField } = useForm<MediaUploadFormModel>({
    validationSchema: toTypedSchema(imageUploadSchema),
    initialValues: {
        displayName: '',
        mediaAlt: '',
        description: ''
    }
});

const [displayName] = defineField('displayName')
const [mediaAlt] = defineField('mediaAlt')
const [description] = defineField('description')

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files[0]) {
        const file = target.files[0];
        setFieldValue('file', file);
    }
}

const handleImageUpload = handleSubmit(values => {
    emit('uploadFiles', [values]);
});
</script>

<template>
    <form @submit.prevent="handleImageUpload" class="m-2 p-4 bg-bone flex flex-col gap-4">
        <div class="flex flex-col">
            <label class="font-inter text-base font-medium" for="imageSelect">Select image:</label>
            <input class="border-jet-black border rounded-xs" @change="handleFileChange" type="file"
                            name=" imageSelect" required>
        </div>

        <div class="flex flex-col">
            <label class="font-inter text-base font-medium" for="displayName">Image name:</label>
            <input class="border-jet-black border rounded-xs" v-model="displayName" type="text"
                name="displayName" required>
            <span v-if="errors.displayName">{{ errors.displayName }}</span>
        </div>

        <div class="flex flex-col">
            <label class="font-inter text-base font-medium" for="imageAlt">Image alternative text:</label>
            <input class="border-jet-black border rounded-xs" v-model="mediaAlt" type="text" name="imageAlt"
                required>
            <span v-if="errors.mediaAlt">{{ errors.mediaAlt }}</span>
        </div>

        <div class="flex flex-col">
            <label class="font-inter text-base font-medium" for="description">Description:</label>
            <textarea class="border-jet-black border rounded-xs" v-model="description" name="description">
            </textarea>
            <span v-if="errors.description">{{ errors.description }}</span>
        </div>

        <button class="bg-jet-black font-bold text-white-smoke self-center px-4 py-2" type="submit">
            Upload photo
        </button>
    </form>
</template>