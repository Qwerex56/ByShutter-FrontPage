import api from '../client'
import type { AddImagesToAlbumRequestDto } from '../dto/album/addImagesToAlbumRequestDto'
import type { AlbumDto } from '../dto/album/albumDto'
import type { AlbumHeaderDto } from '../dto/album/albumHeaderDto'
import type { AlbumMetadataDto } from '../dto/album/albumMetadataDto'
import type { CreateAlbumRequestDto } from '../dto/album/createAlbumRequestDto'
import type { UpdateAlbumRequestDto } from '../dto/album/updateAlbumRequestDto'
import type { PortfolioPhotoDto } from '../dto/photo/portfolioPhotoDto'

export async function getAlbum(albumId: string) {
  const response = await api.get<AlbumDto>(`albums/${albumId}`)

  return response
}

export async function getAlbumHeader(albumId: string) {
  const response = await api.get<AlbumHeaderDto>(`albums/${albumId}/header`)

  return response
}

export async function getAlbumImages(albumId: string, pageSize: number, page: number) {
  const response = await api.get<PortfolioPhotoDto[]>(
    `albums/${albumId}/images/${pageSize}/${page}`,
  )

  return response
}

export async function getAlbumByName(name: string) {
  const response = await api.get(`albums/${encodeURIComponent(name)}`)

  return response.data
}

export async function getAlbums(pageSize: number, page: number) {
  const response = await api.get<AlbumDto[]>(`albums/${pageSize}/${page}`)

  return response
}

export async function getAlbumsMetadata(pageSize: number, page: number) {
  const response = await api.get<AlbumMetadataDto[]>(`albums/${pageSize}/${page}/header`)

  return response
}

export async function createAlbum(data: CreateAlbumRequestDto) {
  const response = await api.post('albums', data)

  return response
}

export async function addImagesToAlbum(albumId: string, data: AddImagesToAlbumRequestDto) {
  const response = await api.put(`albums/${albumId}/add-images`, data)

  return response
}

export async function removeImagesFromAlbum(albumId: string, data: RemoveImagesFromAlbumDto) {}

export async function updateAlbum(data: UpdateAlbumRequestDto) {
  const response = await api.patch(`albums/${data.id}`)

  return response
}
