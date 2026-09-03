import type { PortfolioPhotoDto } from '@/api/dto/photo/portfolioPhotoDto'
import type { UploadPhotoRequestDto } from '@/api/dto/photo/uploadPhotoRequestDto'
import { deletePhoto, getPhotos, updatePhoto, uploadPhoto } from '@/api/endpoints/photos'
import type { MediaUploadFormModel } from '@/components/image_uploader'
import type { MediaEditForm } from '@/types/mediaEditForm'
import { getMediaUrlPath } from '@/utils/mediaUtils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMediaStore = defineStore('media', () => {
  const page = ref(0)
  const pageSize = ref(20)

  const mediaFiles = ref<PortfolioPhotoDto[]>([])

  function setPageSize(newPageSize: number) {
    if (newPageSize <= 0) {
      return
    }

    pageSize.value = newPageSize

    mediaFiles.value = mediaFiles.value.slice(0, newPageSize)
    page.value = calculateCachePage.value
  }

  function getMediaFiles(page: number = 0, pageSize: number = 20): PortfolioPhotoDto[] {
    // Maybe future use, for now we are returning range 0..(page*pageSize+pageSize)
    // const skip = page * pageSize;

    // if (skip > mediaFiles.value.length) {
    //     return [];
    // }

    // const take = pageSize <= mediaFiles.value.length - skip?
    //     pageSize :
    //     Math.abs(mediaFiles.value.length - skip)

    // return mediaFiles.value.slice(skip, take);
    return mediaFiles.value.slice(0, page * pageSize + pageSize)
  }

  async function loadFile() {
    // TODO: Cannot do, no logic at backend side
  }

  async function loadFiles() {
    const data = (await getPhotos(pageSize.value, page.value)).map((image) => {
      if (mediaFiles.value.some((im) => im.id === image.id)) {
        return
      }

      image.serverPath = getMediaUrlPath(image.fileName)
      return image
    })

    data.forEach((image) => {
      if (!image) return

      mediaFiles.value.push(image)
    })

    const cachePageSize = calculateCachePage
    page.value = cachePageSize.value
  }

  async function uploadFile(media: MediaUploadFormModel) {
    const mediaDto: UploadPhotoRequestDto = {
      file: media.file,
      fileName: media.file.name,
      displayName: media.displayName,
      description: media.description,
      mediaAlt: media.mediaAlt,
    }

    var response = await uploadPhoto(mediaDto.file, mediaDto)

    if (response.status === 204) {
      await loadFiles()
    }
  }

  async function uploadFiles(media: MediaUploadFormModel[]) {
    media.forEach(async (m) => {
      await uploadFile(m)
    })
  }

  async function updateFile(mediaId: string, data: MediaEditForm) {
    const response = await updatePhoto({
      photoId: mediaId,
      displayName: data.displayName,
      description: data.description,
      photoAlt: data.mediaAlt,
    })

    if (response.status === 204) {
      const idx = mediaFiles.value.findIndex((m) => m.id === mediaId)

      if (idx === -1) {
        return
      }

      const mediaFile = mediaFiles.value[idx]

      if (!mediaFile) {
        return
      }

      mediaFile.displayName = data.displayName
      mediaFile.description = data.description
      mediaFile.imageAlt = data.mediaAlt

      mediaFiles.value[idx] = mediaFile
    }
  }

  async function deleteFile(mediaId: string) {
    const response = await deletePhoto(mediaId)

    if (response.status !== 204) return

    mediaFiles.value = mediaFiles.value.filter((m) => m.id != mediaId)
    page.value = calculateCachePage.value

    await loadFiles()
  }

  const calculateCachePage = computed(() => Math.floor(mediaFiles.value.length / pageSize.value))

  return {
    getMediaFiles,
    loadFiles,
    uploadFile,
    uploadFiles,
    updateFile,
    deleteFile,
  }
})
