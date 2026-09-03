<template>
    <section ref="card-box" class="relative w-50 h-75">
        <Card class="card one"></Card>
        <Card class="card two"></Card>
        <Card class="card three"></Card>
    </section>
</template>

<style lang="css">
.card {
  transform: translate(var(--fromX), var(--fromY)) rotate(var(--fromRot));
}

.card.one {
  background: red;
  z-index: 3;
}

.card.two {
  background: blue;
  z-index: 2;
}

.card.three {
  background: green;
  z-index: 1;
}

.animate {
  animation:
    shuffle 0.3s ease-out forwards,
    shuffle-back 0.3s ease-in 0.3s forwards;
}

@keyframes shuffle {
  0% {
    transform: translate(var(--fromX), var(--fromY)) rotate(var(--fromRot));
  }
  100% {
    transform: translate(var(--toX), var(--toY)) rotate(var(--toRot));
  }
}

@keyframes shuffle-back {
  0% {
    transform: translate(var(--fromX), var(--fromY)) rotate(var(--fromRot));
  }
  100% {
    transform: translate(var(--toX), var(--toY)) rotate(var(--toRot));
  }
}
</style>

<script setup lang="ts">
import Card from './Card.vue';

import { useTemplateRef, onMounted } from 'vue';
import { initializeCardsProperties, setupAnimationEvents } from './utils.ts';

const box = useTemplateRef<HTMLElement>('card-box');

onMounted(() => {
  const items = box.value?.querySelectorAll('.card') ?? [];

  initializeCardsProperties(items as HTMLElement[]);

  setupAnimationEvents(items as HTMLElement[]);
})
</script>