import api from '../client'
import type { PortfolioPhotoDto } from '../dto/photo/portfolioPhotoDto'
import type UpdatePhotoRequestDto from '../dto/photo/updatePhotoRequestDto'
import type { UploadPhotoRequestDto } from '../dto/photo/uploadPhotoRequestDto'

export async function getPhotos(pageSize: number, page: number): Promise<PortfolioPhotoDto[]> {
  const response = await api.get<PortfolioPhotoDto[]>(`photos/${pageSize}/${page}`)

  return response.data
}

export async function getPhotosNotInAlbum(albumId: string, pageSize: number, page: number) {
  const response = await api.get<PortfolioPhotoDto[]>(`photos/${albumId}/avaiable-photos`, {
    params: {
      page: page,
      pageSize: pageSize,
    },
  })

  return response
}

export async function getPhoto(photoId: string): Promise<PortfolioPhotoDto> {
  const response = await api.get(`photos/${photoId}`)

  return response.data
}

export async function getPhotoByFileName(fileName: string) {
  const response = await api.get(`photos/${encodeURIComponent(fileName)}`)

  return response.data
}

export async function uploadPhoto(file: File, data: Omit<UploadPhotoRequestDto, 'file'>) {
  const form = new FormData()
  form.append('Photo', file)

  if (data.fileName) {
    form.append('FileName', data.fileName)
  }

  if (data.mediaAlt) {
    form.append('ImageAlt', data.mediaAlt)
  }

  if (data.displayName) {
    form.append('DisplayName', data.displayName)
  }

  // if (data.description) {
  // }

  form.append('Description', data.description ?? new Blob())

  const response = await api.post('photos', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response
}

export async function updatePhoto(photoDto: UpdatePhotoRequestDto) {
  const { photoId, ...payload } = photoDto

  const response = await api.put(`photos/${encodeURIComponent(photoId)}`, payload)

  return response
}

export async function deletePhoto(photoId: string) {
  const response = await api.delete(`photos/${encodeURIComponent(photoId)}`)

  return response
}
