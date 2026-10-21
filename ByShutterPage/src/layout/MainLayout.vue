<script setup lang="ts">
import Credits from "@/components/credits/Credits.vue";
import NavigationBar from "@/components/navigation_bar/NavigationBar.vue"
import { ModalsContainer } from "vue-final-modal";

</script>

<template>
  <header class="fixed top-3 left-3 z-50">
    <slot name="NavigationBar">
      <!-- Default Navigation Bar -->
      <NavigationBar v-if="!$route.path.startsWith('/config') && $route.name !== 'Login'" />
    </slot>
  </header>

  <aside>
    <slot name="SideBar">

    </slot>
  </aside>

  <main class="bg-white-smoke">
    <slot name="MainContent">
      <RouterView>
      </RouterView>
    </slot>
  </main>

  <footer class="">
    <slot name="Footer">
    </slot>
  </footer>

  <ModalsContainer />
</template>
