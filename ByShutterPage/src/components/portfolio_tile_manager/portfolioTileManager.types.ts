import type { PortfolioTileForm } from '@/types/homeConfig'
import type { PortfolioTileDto } from '@/api/dto/portfolioTile/portfolioTileDto'

export type PortfolioTileManagerMode = 'create' | 'edit'

export interface PortfolioTileManagerState {
  form: PortfolioTileForm
  tileId: string
  mode: PortfolioTileManagerMode
  message: string
  isBusy: boolean
  loadedTile: PortfolioTileDto | null
}
