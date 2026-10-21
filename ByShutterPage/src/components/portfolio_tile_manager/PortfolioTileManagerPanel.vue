<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VueFinalModal, useModal } from 'vue-final-modal'
import { getPortfolioTiles } from '@/api/endpoints/portfolioTiles'
import type { PortfolioTileDto } from '@/api/dto/portfolioTile/portfolioTileDto'
import PhotoPickerModal from '@/components/photo_picker_modal/PhotoPickerModal.vue'
import { usePortfolioTileManager } from './usePortfolioTileManager'

const manager = usePortfolioTileManager()
const tiles = ref<PortfolioTileDto[]>([])
const page = ref(0)
const hasMore = ref(true)
const editorOpen = ref(false)

async function loadMore() {
  const next = await getPortfolioTiles(12, page.value)
  tiles.value.push(...next)
  page.value += 1
  hasMore.value = next.length === 12
}

function edit(tile: PortfolioTileDto) {
  manager.state.tileId = tile.id
  manager.state.form.name = tile.name
  manager.state.form.description = tile.description ?? ''
  manager.state.form.imageId = tile.imageId
  manager.beginEdit()
  editorOpen.value = true
}

function create() {
  manager.reset()
  editorOpen.value = true
}

function chooseImage() {
  const modal = useModal({
    component: PhotoPickerModal,
    attrs: {
      title: 'Choose tile image',
      selectedId: manager.state.form.imageId,
      onClose: () => modal.close(),
      onSelect: (photo: { id: string }) => {
        manager.state.form.imageId = photo.id
        modal.close()
      },
    },
  })
  modal.open()
}

async function save() {
  await manager.save()
  editorOpen.value = false
  tiles.value = []
  page.value = 0
  hasMore.value = true
  await loadMore()
}

async function remove() {
  await manager.remove()
  editorOpen.value = false
  tiles.value = []
  page.value = 0
  hasMore.value = true
  await loadMore()
}

onMounted(loadMore)
</script>

<template>
  <section class="max-w-6xl">
    <div class="mb-6 flex items-end justify-between gap-4 border-b-2 border-jet-black pb-2">
      <div>
        <p class="font-rouge-script text-3xl text-olive-wood">Shape the grid</p>
        <h2 class="font-playfair-display text-5xl font-black uppercase">Portfolio tiles</h2>
      </div>
      <button type="button" class="admin-button bg-jet-black text-white-smoke" @click="create">New tile</button>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <button v-for="tile in tiles" :key="tile.id" type="button"
        class="min-h-36 bg-jet-black p-4 text-left text-white-smoke transition-transform hover:-translate-y-1"
        @click="edit(tile)">
        <span class="font-inter text-xs text-bone">{{ tile.id }}</span>
        <strong class="mt-3 block font-playfair-display text-2xl uppercase">{{ tile.name }}</strong>
        <span class="mt-2 block truncate font-inter text-sm text-white-smoke/70">{{ tile.description || 'No description'
        }}</span>
      </button>
    </div>
    <button v-if="hasMore" type="button" class="admin-button mt-6 border-2 border-jet-black" @click="loadMore">Load
      more</button>

    <VueFinalModal v-model="editorOpen" class="flex items-center justify-center bg-jet-black/70 p-4 backdrop-blur-sm">
      <form class="w-full max-w-2xl bg-white-smoke p-6" @submit.prevent="save">
        <header class="mb-6 border-b-2 border-jet-black pb-4">
          <h2 class="font-playfair-display text-4xl font-black uppercase">
            {{ manager.isEditing ? 'Edit tile' : 'New tile' }}
          </h2>
        </header>
        <input v-model="manager.state.form.name" class="admin-input" placeholder="Name" required />
        <div class="mt-5 flex gap-3">
          <input v-model="manager.state.form.imageId" class="admin-input mt-0" placeholder="Selected image ID" readonly
            required />
          <button type="button" class="admin-button shrink-0 border-2 border-jet-black" @click="chooseImage">Choose
            image</button>
        </div>
        <textarea v-model="manager.state.form.description" class="admin-input mt-5 min-h-28" placeholder="Description"
          maxlength="256" />
        <div class="mt-7 flex flex-wrap gap-3">
          <button class="admin-button bg-jet-black text-white-smoke" :disabled="manager.state.isBusy">Save</button>
          <button type="button" class="admin-button border-2 border-jet-black"
            @click="editorOpen = false">Close</button>
          <button v-if="manager.isEditing" type="button" class="admin-button bg-olive-wood text-white-smoke"
            :disabled="manager.state.isBusy" @click="remove">Delete</button>
        </div>
        <p v-if="manager.state.message" class="mt-5 border-l-4 border-olive-wood pl-3 font-inter text-sm">{{
          manager.state.message }}</p>
      </form>
    </VueFinalModal>
  </section>
</template>
