<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { MediaEditModel } from './mediaEditModal.types';
import type { MediaEditForm } from '@/types/mediaEditForm';

const props = defineProps<MediaEditModel>();

const mediaEditValidatorSchema = z.object({
    displayName: z.string().min(3).max(32),
    description: z.string().min(0).max(256),
    mediaAlt: z.string().min(3).max(32)
});

const { errors, handleSubmit, setFieldValue, defineField } = useForm<MediaEditForm>({
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
    <VueFinalModal class="flex flex-col gap-4 items-center justify-center bg-jet-black/70 backdrop-blur-sm">
        <section class="flex flex-col justify-center items-center p-4">
            <input type="text" v-model="displayName" class="bg-bone p-2 w-full">
            <span class="text-jet-black" v-if="errors.displayName">{{ errors.displayName }}</span>
            <img :src="mediaSource" :alt="mediaAlt" class="p-4 bg-white-smoke h-16 object-cover">
        </section>

        <section class="p-4">
            <textarea class="bg-white-smoke text-jet-black w-full" v-model="description"></textarea>
            <span class="text-white-smoke" v-if="errors.description">{{ errors.description }}</span>
        </section>

        <section class="flex flex-row w-full gap-1 p-4">
            <button class="px-4 py-2 bg-bone text-jet-black w-full" @click="handleFormSubmit">
                Save Changes
            </button>
            <button class="px-4 py-2 bg-bone text-jet-black w-full" @click="handleFormClose">
                Abort and close
            </button>
            <button class="px-4 py-2 bg-red-500 text-jet-black w-full" @click="handleMediaDelete">
                Delete Image
            </button>
        </section>
    </VueFinalModal>
</template>