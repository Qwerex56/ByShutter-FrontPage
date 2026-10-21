<script setup lang="ts">
import { login } from '@/services/authService'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function submit() {
  error.value = ''
  isLoading.value = true

  try {
    await login(username.value, password.value)
    await router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/config')
  } catch {
    error.value = 'Nieprawidłowa nazwa użytkownika lub hasło.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-dvh items-center justify-center bg-jet-black px-4 py-16 text-white-smoke">
    <form class="w-full max-w-md border border-bone/40 p-6 sm:p-10" @submit.prevent="submit">
      <p class="font-rouge-script text-5xl leading-none text-bone">Private access</p>
      <h1 class="mt-2 font-playfair-display text-5xl font-black uppercase leading-none">Log in</h1>

      <label class="mt-10 block font-inter text-sm uppercase tracking-wide" for="username">Username</label>
      <input id="username" v-model="username"
        class="mt-2 w-full border-b border-white-smoke/50 bg-transparent px-0 py-3 font-inter outline-none focus:border-bone"
        autocomplete="username" required />

      <label class="mt-6 block font-inter text-sm uppercase tracking-wide" for="password">Password</label>
      <input id="password" v-model="password"
        class="mt-2 w-full border-b border-white-smoke/50 bg-transparent px-0 py-3 font-inter outline-none focus:border-bone"
        type="password" autocomplete="current-password" required />

      <p v-if="error" class="mt-5 font-inter text-sm text-bone">{{ error }}</p>
      <button
        class="mt-8 w-full bg-bone px-4 py-3 font-playfair-display text-xl font-bold uppercase text-jet-black transition-colors hover:bg-white-smoke disabled:opacity-50"
        :disabled="isLoading">
        {{ isLoading ? 'Signing in...' : 'Enter' }}
      </button>
      <RouterLink to="/home" class="mt-6 block text-center font-playfair-display text-lg underline underline-offset-4">
        Back to home</RouterLink>
    </form>
  </main>
</template>
