import api from '../client'
import type { CreateHomeProfileRequestDto } from '../dto/homeProfile/createHomeProfileRequestDto'
import type { UpdateHomeProfileRequestDto } from '../dto/homeProfile/updateHomeProfileRequestDto'
import type { HomeProfileDto } from '../dto/homeProfile/homeProfileDto'

export async function getHomeProfile(homeProfileId: string): Promise<HomeProfileDto> {
  const response = await api.get<HomeProfileDto>(`home-profile/${homeProfileId}`)

  return response.data
}

export async function getHomeProfiles(pageSize: number, page: number): Promise<HomeProfileDto[]> {
  const response = await api.get<HomeProfileDto[]>(`home-profile/${pageSize}/${page}`)

  return response.data
}

export async function getHeroSection(homeProfileId: string) {
  const response = await api.get(`home-profile/${homeProfileId}/hero-section`)

  return response.data
}

export async function getAboutMeSection(homeProfileId: string) {
  const response = await api.get(`home-profile/${homeProfileId}/about-me-section`)

  return response.data
}

export async function getHomeImages(homeProfileId: string) {
  const response = await api.get(`home-profile/${homeProfileId}/home-images`)

  return response.data
}

export async function createHomeProfile(data: CreateHomeProfileRequestDto) {
  const response = await api.post('home-profile', data)

  return response.data
}

export async function updateHomeProfile(homeProfileId: string, data: UpdateHomeProfileRequestDto) {
  const response = await api.put(`home-profile/${homeProfileId}`, data)

  return response.data
}

export async function deleteHomeProfile(homeProfileId: string) {
  const response = await api.delete(`home-profile/${homeProfileId}`)

  return response.data
}

export async function assignPortfolioTileToProfile(homeProfileId: string, portfolioTileId: string) {
  const response = await api.put(`home-profile/${homeProfileId}/portfolio-tiles/${portfolioTileId}`)

  return response.data
}

export async function removePortfolioTileFromProfile(
  homeProfileId: string,
  portfolioTileId: string,
) {
  const response = await api.delete(
    `home-profile/${homeProfileId}/portfolio-tiles/${portfolioTileId}`,
  )

  return response.data
}
