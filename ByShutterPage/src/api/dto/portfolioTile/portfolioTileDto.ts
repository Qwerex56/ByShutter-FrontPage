export interface PortfolioTileDto {
  id: string
  name: string
  description: string | null
  image: {
    path: string
    alt: string
  }
  imageId: string
}
