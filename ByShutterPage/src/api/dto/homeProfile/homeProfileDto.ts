import type { PortfolioTileDto } from '../portfolioTile/portfolioTileDto'

export interface HomeProfileDto {
  id: string
  heroMessage: string
  greetings: string
  quote: string
  aboutMe: string
  heroImage: { path: string; alt: string }
  profileImage: { path: string; alt: string }
  heroImageId: string
  profileImageId: string
  portfolioTiles: PortfolioTileDto[]
}
