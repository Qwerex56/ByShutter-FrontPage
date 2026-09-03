<script setup lang="ts">
import type { PhotoPreviewEvents, PhotoPreviewModel } from './photoPreview.types';

const props = defineProps<PhotoPreviewModel>();
const emits = defineEmits<PhotoPreviewEvents>();

const handleDelete = () => {
    const confirm = window.confirm(`Do you really want to delete this media? ${props.displayName?? props.name}\nTHIS CAN NOT BE UNDONE`);

    if (confirm) {
        emits('delete', props.id);
    }
}
</script>

<template>
<section class="flex flex-col gap-2 bg-jet-black text-white-smoke p-2 font-inter">
    <p class="text-2xl text-ellipsis overflow-hidden whitespace-nowrap">
        {{ props.displayName?? props.name }}
    </p>
    
    <img class="max-h-24 object-scale-down"
    :src="source" :alt="imageAlt">
    
    <div class="flex w-full justify-around p-1 gap-1">
        <button class="bg-bone text-jet-black py-1 px-2"
        @click="emits('edit', id)">
            Edit
        </button>
        <button class="bg-bone text-jet-black py-1 px-2"
        @click="handleDelete">
            Delete
        </button>
    </div>
</section>
</template>