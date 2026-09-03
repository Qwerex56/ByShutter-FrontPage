<script setup lang="ts">
import AboutMePage from '@/pages/home/AboutMePage.vue';
import Gallerypage from '@/pages/home/Gallerypage.vue';
import TitlePage from '@/pages/home/TitlePage.vue';
import { onMounted, ref } from 'vue';

interface HomeProfile {
    heroMessage: string,
    heroImagePath?: string,
    heroImageAlt: string,

    greetings: string,
    quote: string,
    aboutMe: string,

    profileImagePath?: string,
    profileImageAlt: string
};

const data = ref<HomeProfile>();

onMounted(async () => {
    const response = await fetch("http://localhost:5700/api/home-profile/019f758b-5132-79f1-bd4b-a1c8db932b2e");
    data.value = await response.json();
})
</script>

<template>
    <section>
        <TitlePage :hero-text="data?.heroMessage">

        </TitlePage>
    </section>

    <section class="bg-bone p-2 pb-8">
        <AboutMePage :profile-image-alt="data?.profileImageAlt?? 'profile alt'">
            <template #Greetings>
                {{ data?.greetings }}
            </template>

            <template #Quote>
                {{ data?.quote }}
            </template>

            <template #AboutMe>
                {{ data?.aboutMe }}
            </template>
        </AboutMePage>
    </section>

    <section class="p-2">
        <Gallerypage>
            
        </Gallerypage>
    </section>
</template>