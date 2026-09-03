import { type PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto'
import { getPhotosNotInAlbum } from '@/api/endpoints/photos'
import { getMediaUrlPath } from '@/utils/mediaUtils'
import { ref, watchEffect } from 'vue'

export function useAddPhotosToAlbum(albumId: string) {
  const media = ref<PortfolioPhotoDto[]>([])
  const page = ref(0)
  const pageSize = ref(20)

  const isLoading = ref(false)
  const hasMore = ref(false)

  async function loadFiles() {
    console.log(page.value)
    isLoading.value = true

    const response = await getPhotosNotInAlbum(albumId, pageSize.value, page.value)
    isLoading.value = false

    if (response.status !== 200) {
      return
    }

    response.data.forEach((p) => (p.serverPath = getMediaUrlPath(p.fileName)))

    media.value.push(...response.data)

    hasMore.value = response.data.length > 0
    page.value = page.value + 1
  }

  // watchEffect(() => {
  //   page.value = 0
  //   loadFiles()
  // })

  return {
    media,
    isLoading,
    hasMore,
    nextPage: () => loadFiles(),
  }
}
