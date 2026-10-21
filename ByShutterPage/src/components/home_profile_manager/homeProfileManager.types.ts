import type { HomeProfileForm } from '@/types/homeConfig'

export interface HomeProfileManagerState {
  form: HomeProfileForm
  profileId: string
  tileId: string
  message: string
  isBusy: boolean
}
