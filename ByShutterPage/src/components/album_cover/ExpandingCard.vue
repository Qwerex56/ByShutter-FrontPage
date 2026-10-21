<script setup lang="ts">
import { useMouse } from '@vueuse/core';
import { onMounted, ref } from 'vue';

interface Props {
  isActive?: boolean,
  id?: number
  title?: string
  description?: string
  imageSource?: string
  imageAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  title: 'Motorhome',
  description: 'Some descriptive description about this album that is no longer than 2 lines',
  imageSource: '/profilepicture.png',
  imageAlt: 'Portfolio tile',
})

const emit = defineEmits<{
  stateChanged: [active: boolean, id?: number],
  openAlbum: [id: number]
}>();

// let active = ref(false);
const { sourceType } = useMouse();
</script>

<template>
  <div @click="() => {/*if (sourceType === 'mouse') {return}*/ $emit('stateChanged', isActive, id) }"
    @mouseenter="() => { $emit('stateChanged', isActive, id) }"
    @mouseleave="() => { $emit('stateChanged', isActive, id) }"
    class="flex flex-col relative group backdrop-blur-xs min-h-64 overflow-hidden">
    <img :src="props.imageSource" :alt="props.imageAlt"
      class="absolute left-0 top-0 h-full w-full object-cover object-left -z-1" :class="isActive ? 'blur-xs' : ''">

    <div class="absolute w-full h-full bg-jet-black/70 -z-1 object-cover object-left"
      :class="isActive ? 'block' : 'hidden'"></div>

    <h2 class="mb-auto p-2
        font-playfair-display font-black text-white-smoke text-3xl
        h-full text-ellipsis overflow-hidden whitespace-nowrap" :class="isActive ? 'no-underline' : 'underline'">
      {{ props.title }}
    </h2>

    <div class="flex-col p-2 gap-2 w-full justify-self-end" :class="isActive ? 'flex' : 'hidden'">
      <p class="font-inter text-sm text-white-smoke">
        {{ props.description }}
      </p>

      <button @click.stop="emit('openAlbum', props.id)"
        class="py-1 px-2 font-playfair-display text-right text-3xl font-bold uppercase underline bg-bone w-full">
        See more
      </button>
    </div>
  </div>
</template>
