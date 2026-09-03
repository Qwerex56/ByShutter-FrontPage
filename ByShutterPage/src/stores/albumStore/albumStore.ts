import type { AlbumDto } from '@/api/dto/album/albumDto'
import type { CreateAlbumRequestDto } from '@/api/dto/album/createAlbumRequestDto'
import type { UpdateAlbumRequestDto } from '@/api/dto/album/updateAlbumRequestDto'
import {
  createAlbum,
  getAlbum,
  getAlbumHeader,
  getAlbums,
  updateAlbum,
} from '@/api/endpoints/albums'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAlbumStore = defineStore('albumStore', () => {
  const page = ref(0)
  const pageSize = ref(20)

  const albums = ref<AlbumDto[]>([])

  function getAlbumsPage(page: number = 0, pageSize: number = 20) {
    return albums.value.slice(0, page * pageSize + pageSize)
  }

  async function loadAlbum(id: string) {
    const response = await getAlbum(id)

    if (response.status == 200) {
      // success
    }
  }

  async function loadAlbumHeader(id: string) {
    const response = await getAlbumHeader(id)

    if (response.status !== 200) {
      console.error(response.statusText)
    }

    return response.data
  }

  async function loadAlbums() {
    const response = await getAlbums(pageSize.value, page.value)

    if (response.status !== 200) {
      return
    }
    let data = response.data

    data = data.filter(
      (candidate) => !albums.value.some((existing) => existing.id === candidate.id),
    )

    albums.value.push(...data)

    const newPage = calculateCachePage
    page.value = newPage.value
  }

  async function getAlbumsHeaderPaginated(pageSize: number, page: number) {}

  async function createNewAlbum(dto: CreateAlbumRequestDto) {
    const response = await createAlbum(dto)

    if (response.status === 204) {
      return // OK
    }
  }

  async function updateAlbumData(dto: UpdateAlbumRequestDto) {
    const response = await updateAlbum(dto)
  }

  function addMediaToAlbum(mediaId: string) {}

  function removeMediaFromAlbum() {}

  const calculateCachePage = computed(() => Math.floor(albums.value.length / pageSize.value))

  return {
    getAlbumsPage,
    loadAlbum,
    loadAlbums,
  }
})
