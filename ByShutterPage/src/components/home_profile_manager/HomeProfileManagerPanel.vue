<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VueFinalModal, useModal } from 'vue-final-modal'
import { assignPortfolioTileToProfile, getHomeProfiles, removePortfolioTileFromProfile } from '@/api/endpoints/homeProfile'
import { getPortfolioTiles } from '@/api/endpoints/portfolioTiles'
import type { HomeProfileDto } from '@/api/dto/homeProfile/homeProfileDto'
import type { PortfolioTileDto } from '@/api/dto/portfolioTile/portfolioTileDto'
import PhotoPickerModal from '@/components/photo_picker_modal/PhotoPickerModal.vue'
import { useHomeProfileManager } from './useHomeProfileManager'

const manager = useHomeProfileManager()
const profiles = ref<HomeProfileDto[]>([])
const page = ref(0)
const hasMore = ref(true)
const editorOpen = ref(false)
const tiles = ref<PortfolioTileDto[]>([])
const tilePage = ref(0)
const hasMoreTiles = ref(true)
const selectedTileIds = ref<string[]>([])
const savedTileIds = ref<string[]>([])

async function loadMore() {
  const next = await getHomeProfiles(10, page.value)
  profiles.value.push(...next)
  page.value += 1
  hasMore.value = next.length === 10
}

async function loadMoreTiles() {
  const next = await getPortfolioTiles(12, tilePage.value) as PortfolioTileDto[]
  tiles.value.push(...next)
  tilePage.value += 1
  hasMoreTiles.value = next.length === 12
}

function edit(profile: HomeProfileDto) {
  manager.state.profileId = profile.id
  Object.assign(manager.state.form, profile)
  editorOpen.value = true
  selectedTileIds.value = profile.portfolioTiles.map(tile => tile.id)
  savedTileIds.value = [...selectedTileIds.value]
}

function create() {
  manager.state.profileId = ''
  Object.assign(manager.state.form, { heroMessage: '', greetings: '', quote: '', aboutMe: '', heroImageId: '', profileImageId: '' })
  editorOpen.value = true
  selectedTileIds.value = []
  savedTileIds.value = []
}

function toggleTile(tileId: string) {
  if (selectedTileIds.value.includes(tileId)) {
    selectedTileIds.value = selectedTileIds.value.filter(id => id !== tileId)
    return
  }

  if (selectedTileIds.value.length < 4) selectedTileIds.value.push(tileId)
}

function chooseImage(field: 'heroImageId' | 'profileImageId') {
  const modal = useModal({
    component: PhotoPickerModal,
    attrs: {
      title: 'Choose profile image',
      selectedId: manager.state.form[field],
      onClose: () => modal.close(),
      onSelect: (photo: { id: string }) => {
        manager.state.form[field] = photo.id
        modal.close()
      },
    },
  })
  modal.open()
}

async function save() {
  if (manager.state.profileId) await manager.update()
  else await manager.create()
  if (manager.state.profileId && selectedTileIds.value.length === 4) {
    const added = selectedTileIds.value.filter(id => !savedTileIds.value.includes(id))
    const removed = savedTileIds.value.filter(id => !selectedTileIds.value.includes(id))
    await Promise.all([
      ...added.map(tileId => assignPortfolioTileToProfile(manager.state.profileId, tileId)),
      ...removed.map(tileId => removePortfolioTileFromProfile(manager.state.profileId, tileId)),
    ])
  }
  editorOpen.value = false
  profiles.value = []
  page.value = 0
  hasMore.value = true
  await loadMore()
}

async function remove() {
  await manager.remove()
  editorOpen.value = false
  profiles.value = []
  page.value = 0
  hasMore.value = true
  await loadMore()
}

onMounted(() => {
  loadMore()
  loadMoreTiles()
})
</script>

<template>
  <section class="max-w-6xl">
    <div class="mb-6 flex items-end justify-between gap-4 border-b-2 border-jet-black pb-2">
      <div>
        <p class="font-rouge-script text-3xl text-olive-wood">The front page story</p>
        <h2 class="font-playfair-display text-5xl font-black uppercase">Home profiles</h2>
      </div>
      <button type="button" class="admin-button bg-jet-black text-white-smoke" @click="create">New profile</button>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <button v-for="profile in profiles" :key="profile.id" type="button"
        class="min-h-36 bg-bone p-4 text-left transition-transform hover:-translate-y-1" @click="edit(profile)">
        <span class="font-inter text-xs text-olive-wood">{{ profile.id }}</span>
        <strong class="mt-3 block font-playfair-display text-2xl uppercase">{{ profile.heroMessage }}</strong>
        <span class="mt-2 block truncate font-inter text-sm text-jet-black/70">{{ profile.aboutMe }}</span>
      </button>
    </div>
    <button v-if="hasMore" type="button" class="admin-button mt-6 border-2 border-jet-black" @click="loadMore">Load
      more</button>

    <VueFinalModal v-model="editorOpen" class="flex items-center justify-center bg-jet-black/70 p-4 backdrop-blur-sm">
      <form class="max-h-[90dvh] w-full max-w-3xl overflow-y-auto bg-white-smoke p-6" @submit.prevent="save">
        <h2 class="mb-6 border-b-2 border-jet-black pb-4 font-playfair-display text-4xl font-black uppercase">{{
          manager.state.profileId ? 'Edit profile' : 'New profile' }}</h2>
        <div class="grid gap-5 md:grid-cols-2">
          <input v-model="manager.state.form.heroMessage" class="admin-input" placeholder="Hero message" required />
          <input v-model="manager.state.form.greetings" class="admin-input" placeholder="Greetings" required />
          <input v-model="manager.state.form.quote" class="admin-input" placeholder="Quote" required />
          <div class="flex gap-3"><input v-model="manager.state.form.heroImageId" class="admin-input mt-0"
              placeholder="Hero image" readonly required /><button type="button"
              class="admin-button border-2 border-jet-black" @click="chooseImage('heroImageId')">Choose</button></div>
          <div class="flex gap-3"><input v-model="manager.state.form.profileImageId" class="admin-input mt-0"
              placeholder="Profile image" readonly required /><button type="button"
              class="admin-button border-2 border-jet-black" @click="chooseImage('profileImageId')">Choose</button>
          </div>
        </div>
        <textarea v-model="manager.state.form.aboutMe" class="admin-input mt-5 min-h-32" placeholder="About me"
          required />
        <section class="mt-8 border-t-2 border-jet-black pt-5">
          <p class="font-rouge-script text-3xl text-olive-wood">Build the selection</p>
          <h3 class="font-playfair-display text-3xl font-black uppercase">Portfolio tiles</h3>
          <div class="mt-4 grid gap-2 sm:grid-cols-2">
            <button v-for="tile in tiles" :key="tile.id" type="button" class="border-2 p-3 text-left transition-colors"
              :class="selectedTileIds.includes(tile.id) ? 'border-olive-wood bg-bone' : 'border-jet-black/20'"
              @click="toggleTile(tile.id)">
              <span class="block font-playfair-display text-lg font-bold uppercase">{{ tile.name }}</span>
              <span class="block truncate font-inter text-xs text-jet-black/65">{{ tile.description || 'No description'
                }}</span>
            </button>
          </div>
          <button v-if="hasMoreTiles" type="button" class="admin-button mt-4 border-2 border-jet-black"
            :disabled="manager.state.isBusy" @click="loadMoreTiles">Load more tiles</button>
          <p class="mt-4 font-inter text-sm">Selected {{ selectedTileIds.length }} / 4</p>
        </section>
        <div class="mt-7 flex flex-wrap gap-3"><button class="admin-button bg-jet-black text-white-smoke"
            :disabled="manager.state.isBusy || selectedTileIds.length !== 4">Save</button><button type="button"
            class="admin-button border-2 border-jet-black" @click="editorOpen = false">Close</button><button
            v-if="manager.state.profileId" type="button" class="admin-button bg-olive-wood text-white-smoke"
            :disabled="manager.state.isBusy" @click="remove">Delete</button></div>
        <p v-if="manager.state.message" class="mt-5 border-l-4 border-olive-wood pl-3 font-inter text-sm">{{
          manager.state.message }}</p>
      </form>
    </VueFinalModal>
  </section>
</template>
