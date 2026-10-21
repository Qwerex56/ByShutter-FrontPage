<script setup lang="ts">
import { getHomeProfile } from '@/api/endpoints/homeProfile'
import { getPhoto } from '@/api/endpoints/photos'
import type { HomeProfileDto } from '@/api/dto/homeProfile/homeProfileDto'
import { getMediaUrlPath } from '@/utils/mediaUtils'
import { onMounted, ref } from 'vue'

const profile = ref<HomeProfileDto>()
const imageUrl = ref('')
const homeProfileId = import.meta.env.VITE_HOME_PROFILE_ID ?? '01a06bdd-b086-75fc-9558-e87850326ff0'

onMounted(async () => {
  profile.value = await getHomeProfile(homeProfileId)
  const photo = await getPhoto(profile.value.profileImageId)
  imageUrl.value = getMediaUrlPath(photo.fileName)
})
</script>

<template>
  <main class="min-h-dvh bg-bone px-4 pb-20 pt-28 text-jet-black md:px-10 lg:px-16">
    <header class="mx-auto mb-16 max-w-6xl border-b-2 border-jet-black pb-8">
      <p class="font-rouge-script text-5xl leading-none text-olive-wood md:text-6xl">Behind the lens</p>
      <h1 class="font-playfair-display text-6xl font-black uppercase leading-none md:text-8xl">About me</h1>
    </header>

    <section class="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(220px,0.7fr)_1.3fr] md:items-start">
      <img v-if="imageUrl" :src="imageUrl" :alt="profile?.profileImage.alt ?? 'Piotrek'"
        class="w-full max-w-md object-cover" />
      <div class="font-inter text-base font-light leading-relaxed md:pt-4">
        <p class="mb-8 font-playfair-display text-4xl font-black uppercase leading-tight">Piotrek fotografuje to, co ma
          charakter.</p>
        <p class="max-w-[62ch]">{{ profile?.aboutMe }}</p>
        <p class="mt-6 max-w-[62ch]">Najczęściej pracuję przy samochodach. Interesuje mnie ich forma, ślady użytkowania
          i moment, w którym maszyna zaczyna opowiadać historię właściciela. Szukam światła, które nie udaje perfekcji,
          tylko wydobywa prawdziwe emocje.</p>
        <p class="mt-6 max-w-[62ch]">Sesja nie jest dla mnie katalogiem ujęć. To wspólne szukanie miejsca, rytmu i
          kadru, który zostanie z Tobą na dłużej.</p>
        <RouterLink to="/albums"
          class="mt-12 inline-block border-b-2 border-jet-black pb-1 font-playfair-display text-2xl font-bold uppercase underline underline-offset-4 hover:text-olive-wood">
          See the albums</RouterLink>
      </div>
    </section>
  </main>
</template>
