import AdminAlbumView from '@/views/AdminAlbumView.vue'
import AlbumManager from '@/views/AlbumManager.vue'
import ContactView from '@/views/ContactView.vue'
import FileManager from '@/views/FileManager.vue'
import HomeView from '@/views/HomeView.vue'
import HomeProfileManager from '@/views/HomeProfileManager.vue'
import PortfolioTileManager from '@/views/PortfolioTileManager.vue'
import SiteConfigView from '@/views/SiteConfigView.vue'
import AboutMeView from '@/views/AboutMeView.vue'
import AlbumsView from '@/views/AlbumsView.vue'
import AlbumView from '@/views/AlbumView.vue'
import LoginView from '@/views/LoginView.vue'
import { isAuthenticated } from '@/services/authService'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomeView },
    { path: '/contact', component: ContactView },
    { path: '/about-me', component: AboutMeView },
    { path: '/AboutMe', redirect: '/about-me' },
    { path: '/albums', component: AlbumsView, name: 'PublicAlbums' },
    { path: '/albums/:id', component: AlbumView, name: 'PublicAlbum', props: true },
    { path: '/login', component: LoginView, name: 'Login' },
    { path: '/config', component: SiteConfigView, name: 'config' },
    { path: '/config/files', component: FileManager, name: 'Files' },
    { path: '/config/albums', component: AlbumManager, name: 'Albums' },
    { path: '/config/tiles', component: PortfolioTileManager, name: 'PortfolioTileManager' },
    { path: '/config/profiles', component: HomeProfileManager, name: 'HomeProfileManager' },
    { path: '/config/albums/:id', component: AdminAlbumView, name: 'AdminAlbumView', props: true },
  ],
})

router.beforeEach(async (to) => {
  if (to.path.startsWith('/config') && !(await isAuthenticated())) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'Login' && (await isAuthenticated())) {
    return '/config'
  }
})

export default router
