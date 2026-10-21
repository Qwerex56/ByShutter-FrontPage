import api from '../client'
import type { CreatePortfolioTileRequestDto } from '../dto/portfolioTile/createPortfolioTileRequestDto'
import type { PortfolioTileDto } from '../dto/portfolioTile/portfolioTileDto'
import type { UpdatePortfolioTileRequestDto } from '../dto/portfolioTile/updatePortfolioTileRequestDto'

export async function getPortfolioTiles(pageSize: number, page: number) {
  const response = await api.get(`portfolio-tiles/${pageSize}/${page}`)

  return response.data
}

export async function getPortfolioTile(portfolioTileId: string): Promise<PortfolioTileDto> {
  const response = await api.get<PortfolioTileDto>(`portfolio-tiles/${portfolioTileId}`)

  return response.data
}

export async function createPortfolioTile(data: CreatePortfolioTileRequestDto) {
  const response = await api.post('portfolio-tiles', data)

  return response.data
}

export async function updatePortfolioTile(
  portfolioTileId: string,
  data: UpdatePortfolioTileRequestDto,
) {
  const response = await api.put(`portfolio-tiles/${portfolioTileId}`, data)

  return response.data
}

export async function deletePortfolioTile(portfolioTileId: string) {
  const response = await api.delete(`portfolio-tiles/${portfolioTileId}`)

  return response.data
}
