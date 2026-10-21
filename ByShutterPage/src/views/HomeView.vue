<script setup lang="ts">
import AboutMePage from '@/pages/home/AboutMePage.vue';
import Gallerypage from '@/pages/home/Gallerypage.vue';
import TitlePage from '@/pages/home/TitlePage.vue';
import { getHomeProfile } from '@/api/endpoints/homeProfile';
import type { HomeProfileDto } from '@/api/dto/homeProfile/homeProfileDto';
import { getPhoto } from '@/api/endpoints/photos';
import { getMediaUrlPath } from '@/utils/mediaUtils';
import { onMounted, ref } from 'vue';

const data = ref<HomeProfileDto>();
const heroImageUrl = ref<string>();
const profileImageUrl = ref<string>();
const tileImageUrls = ref<Record<string, string>>({});
const homeProfileId = import.meta.env.VITE_HOME_PROFILE_ID ?? '01a06bdd-b086-75fc-9558-e87850326ff0';

onMounted(async () => {
  const profile = await getHomeProfile(homeProfileId);
  data.value = profile;

  const photos = await Promise.all([
    getPhoto(profile.heroImageId),
    getPhoto(profile.profileImageId),
    ...profile.portfolioTiles.map(async tile => await getPhoto(tile.imageId)),
  ]);

  const [heroPhoto, profilePhoto, ...tilePhotos] = photos;
  heroImageUrl.value = heroPhoto ? getMediaUrlPath(heroPhoto.fileName) : undefined;
  profileImageUrl.value = profilePhoto ? getMediaUrlPath(profilePhoto.fileName) : undefined;
  tileImageUrls.value = Object.fromEntries(
    profile.portfolioTiles.map((tile, index) => [tile.id, getMediaUrlPath(tilePhotos[index]!.fileName)]),
  );
})
</script>

<template>
  <section>
    <TitlePage :hero-text="data?.heroMessage" :hero-image="heroImageUrl" :hero-image-alt="data?.heroImage.alt" />
  </section>

  <section class="bg-bone p-2 pb-8">
    <AboutMePage :greetings="data?.greetings" :quote="data?.quote" :about-me="data?.aboutMe"
      :profile-image="profileImageUrl" :profile-image-alt="data?.profileImage.alt" />
  </section>

  <section class="p-2">
    <Gallerypage :portfolio-tiles="data?.portfolioTiles" :tile-image-urls="tileImageUrls" />
  </section>
</template>
