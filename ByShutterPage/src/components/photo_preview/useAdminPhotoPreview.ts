import { type PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto'
import { getAlbumImages } from '@/api/endpoints/albums'
import { getPhotos } from '@/api/endpoints/photos'
import { ref, watchEffect } from 'vue'

export function useAdminPhotoPreview(albumId: string, basePageSize: number = 20) {
  const media = ref<PortfolioPhotoDto[]>([])
  const page = ref(0)
  const pageSize = ref(basePageSize)

  const isLoading = ref(true)
  const hasMore = ref(true)

  async function loadPage(newPage: number) {
    isLoading.value = true

    const response = await getAlbumImages(albumId, pageSize.value, page.value)
    isLoading.value = false

    if (response.status !== 200) {
      return
    }

    media.value = response.data

    hasMore.value = response.data.length > 0
    page.value = newPage
  }

  watchEffect(() => {
    page.value = 0
    loadPage(0)
  })

  return {
    media,
    isLoading,
    hasMore,
    page,
    nextPage: () => loadPage(page.value + 1),
    prevPage: () => loadPage(page.value - 1),
  }
}
