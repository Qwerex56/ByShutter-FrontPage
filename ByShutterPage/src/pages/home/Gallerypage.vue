<script setup lang="ts">
import ExpandingCard from '@/components/album_cover/ExpandingCard.vue';
import type { PortfolioTileDto } from '@/api/dto/portfolioTile/portfolioTileDto';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  portfolioTiles?: PortfolioTileDto[]
  tileImageUrls?: Record<string, string>
}>()

const fallbackCards = [
  { title: 'Motorhome', description: 'Some descriptive description about this album that is no longer than 2 lines', imageSource: '/profilepicture.png', imageAlt: 'Portfolio tile' },
  { title: 'Portraits', description: 'A quiet collection of portraits and soft natural light', imageSource: '/profilepicture.png', imageAlt: 'Portfolio tile' },
  { title: 'Landscape', description: 'Places, textures and moments from the road', imageSource: '/profilepicture.png', imageAlt: 'Portfolio tile' },
  { title: 'Stories', description: 'Small stories gathered between destinations', imageSource: '/profilepicture.png', imageAlt: 'Portfolio tile' },
]

const cardsToRender = computed(() => Array.from({ length: 4 }, (_, index) => {
  const tile = props.portfolioTiles?.[index]
  return tile ? {
    title: tile.name,
    description: tile.description ?? '',
    imageSource: props.tileImageUrls?.[tile.id] ?? '/profilepicture.png',
    imageAlt: tile.image.alt,
  } : fallbackCards[index]
}))

const cards = ref([
  false, false,
  false, false,
])

const onCardStateChangedHandler = (isActive: boolean, id?: number) => {
  if (id === undefined) {
    return;
  }

  for (let i = 0; i < cards.value.length; i++) {
    if (i === id) {
      cards.value[i] = isActive ? false : true;
      continue;
    }

    cards.value[i] = false;
  }
}

const onOpenAlbumHandler = (albumId: number) => {
  const card = cardsToRender.value[albumId];

  router.push(`/albums`)
}
</script>

<template>
  <article class="flex flex-col w-full gap-8 py-8">
    <h1 class="font-playfair-display text-5xl font-black">
      Portfolio
    </h1>

    <div class="md:max-w-2/3 w-full self-center">
      <div class="flex gap-1 w-full px-2 mb-1">
        <ExpandingCard :id="0" :is-active="cards[0]" ref="card-1"
          class="peer w-full min-w-0 hover:flex-20 transition-all duration-100" :class="cards[0] ? 'flex-20' : 'flex-4'"
          v-bind="cardsToRender[0]" @state-changed="onCardStateChangedHandler" @open-album="onOpenAlbumHandler" />

        <ExpandingCard :id="1" :is-active="cards[1]" ref="card-2"
          class="peer w-full min-w-0 hover:flex-16 transition-all duration-100" :class="cards[1] ? 'flex-16' : 'flex-6'"
          v-bind="cardsToRender[1]" @state-changed="onCardStateChangedHandler" @open-album="onOpenAlbumHandler" />
      </div>

      <div class="flex gap-1 w-full px-2">
        <ExpandingCard :id="2" :is-active="cards[2]" ref="card-3"
          class="peer w-full min-w-0 hover:flex-16 transition-all duration-100" :class="cards[2] ? 'flex-16' : 'flex-6'"
          v-bind="cardsToRender[2]" @state-changed="onCardStateChangedHandler" @open-album="onOpenAlbumHandler" />

        <ExpandingCard :id="3" :is-active="cards[3]" ref="card-4"
          class="peer w-full min-w-0 hover:flex-20 transition-all duration-100" :class="cards[3] ? 'flex-20' : 'flex-4'"
          v-bind="cardsToRender[3]" @state-changed="onCardStateChangedHandler" @open-album="onOpenAlbumHandler" />
      </div>
    </div>

    <RouterLink to="/albums"
      class="mt-8 px-9 text-right font-playfair-display text-4xl underline text-jet-black font-bold uppercase">
      ...See More
    </RouterLink>
  </article>
</template>
