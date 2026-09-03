import AdminAlbumView from '@/views/AdminAlbumView.vue'
import AlbumManager from '@/views/AlbumManager.vue'
import ContactView from '@/views/ContactView.vue'
import FileManager from '@/views/FileManager.vue'
import HomeView from '@/views/HomeView.vue'
import SiteConfigView from '@/views/SiteConfigView.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/home', component: HomeView },
    { path: '/contact', component: ContactView },
    { path: '/config', component: SiteConfigView, name: 'config' },
    { path: '/config/files', component: FileManager, name: 'Files' },
    { path: '/config/albums', component: AlbumManager, name: 'Albums' },
    { path: '/config/albums/:id', component: AdminAlbumView, name: 'AdminAlbumView', props: true },
  ],
})

export default router
