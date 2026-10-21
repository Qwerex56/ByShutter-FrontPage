<script setup lang="ts">
import type { PhotoPreviewEvents, PhotoPreviewModel } from './photoPreview.types';

const props = withDefaults(defineProps<PhotoPreviewModel>(), {
  isSelcted: false
});
const emits = defineEmits<PhotoPreviewEvents>();

const handleDelete = () => {
  const confirm = window.confirm(`Do you really want to delete this media? ${props.displayName ?? props.name}\nTHIS CAN NOT BE UNDONE`);

  if (confirm) {
    emits('delete', props.id);
  }
}

const handleSelect = () => (
  emits('select', props.id)
)
</script>

<template>
  <section class="group flex h-full flex-col gap-3 bg-jet-black p-3 font-inter text-white-smoke" @click="handleSelect">
    <div class="relative">
      <p class="overflow-hidden text-ellipsis whitespace-nowrap font-playfair-display text-2xl font-bold">
        {{ props.displayName ?? props.name }}
      </p>

      <div class="absolute right-2 top-2 z-10 h-4 w-4 rounded-full border-2 border-white-smoke shadow"
        :class="isSelcted ? 'bg-olive-wood' : 'bg-jet-black/40'">
      </div>
    </div>

    <img class="aspect-square w-full object-cover transition-opacity duration-200 group-hover:opacity-80" :src="source"
      :alt="imageAlt">

    <div class="mt-auto flex w-full gap-1">
      <button
        class="flex-1 bg-bone px-2 py-1 font-playfair-display text-lg font-bold uppercase text-jet-black underline decoration-1 underline-offset-2 transition-colors hover:bg-olive-wood hover:text-white-smoke"
        @click="emits('edit', id)">
        Edit
      </button>
      <button
        class="flex-1 bg-bone px-2 py-1 font-playfair-display text-lg font-bold uppercase text-jet-black underline decoration-1 underline-offset-2 transition-colors hover:bg-red-700 hover:text-white-smoke"
        @click.stop="handleDelete">
        Delete
      </button>
    </div>
  </section>
</template>
