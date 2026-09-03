<script setup lang="ts">
import ExpandingCard from '@/components/album_cover/ExpandingCard.vue';
import { ref } from 'vue';

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
            cards.value[i] = isActive? false : true;
            continue;
        }
        
        cards.value[i] = false;
    }
}
</script>

<template>
    <article class="flex flex-col w-full">
        <h1 class="font-playfair-display text-5xl font-black">
            Portfolio
        </h1>

        <div>
            <div class="flex gap-1 w-full px-2 mb-1">
                <ExpandingCard :id="0" :is-active="cards[0]" ref="card-1" 
                class="peer w-full min-w-0 hover:flex-20 transition-all duration-100"
                :class="cards[0]? 'flex-20' : 'flex-4'"
                @state-changed="onCardStateChangedHandler" />

                <ExpandingCard :id="1" :is-active="cards[1]" ref="card-2" 
                class="peer w-full min-w-0 hover:flex-16 transition-all duration-100"
                :class="cards[1]? 'flex-16' : 'flex-6'"
                @state-changed="onCardStateChangedHandler" />
            </div>

            <div class="flex gap-1 w-full px-2">
                <ExpandingCard :id="2" :is-active="cards[2]" ref="card-3" 
                class="peer w-full min-w-0 hover:flex-16 transition-all duration-100"
                :class="cards[2]? 'flex-16' : 'flex-6'"
                @state-changed="onCardStateChangedHandler" />

                <ExpandingCard :id="3" :is-active="cards[3]" ref="card-4" 
                class="peer w-full min-w-0 hover:flex-20 transition-all duration-100" 
                :class="cards[3]? 'flex-20' : 'flex-4'"
                @state-changed="onCardStateChangedHandler" />
            </div>
        </div>

        <RouterLink to="/gallery" class="mt-8 px-9 text-right font-playfair-display text-4xl underline text-jet-black font-bold uppercase">
            ...See More
        </RouterLink>
    </article>
</template>