import { reactive } from 'vue'
import {
  assignPortfolioTileToProfile,
  createHomeProfile,
  deleteHomeProfile,
  getHomeProfile,
  removePortfolioTileFromProfile,
  updateHomeProfile,
} from '@/api/endpoints/homeProfile'
import type { HomeProfileForm } from '@/types/homeConfig'
import { homeProfileFormSchema } from './homeProfileManager.validation'
import type { HomeProfileManagerState } from './homeProfileManager.types'

const emptyForm = (): HomeProfileForm => ({
  heroMessage: '',
  greetings: '',
  quote: '',
  aboutMe: '',
  heroImageId: '',
  profileImageId: '',
})

export function useHomeProfileManager() {
  const state = reactive<HomeProfileManagerState>({
    form: emptyForm(),
    profileId: '',
    tileId: '',
    message: '',
    isBusy: false,
  })

  function validateForm() {
    const parsed = homeProfileFormSchema.safeParse(state.form)
    if (!parsed.success) state.message = parsed.error.issues[0]?.message ?? 'Invalid profile data.'
    return parsed.success
  }

  async function load() {
    if (!state.profileId) {
      state.message = 'Enter a profile ID to load.'
      return
    }
    state.isBusy = true
    try {
      const profile = await getHomeProfile(state.profileId)
      Object.assign(state.form, {
        heroMessage: profile.heroMessage,
        greetings: profile.greetings,
        quote: profile.quote,
        aboutMe: profile.aboutMe,
        heroImageId: profile.heroImageId,
        profileImageId: profile.profileImageId,
      })
      state.message = 'Home profile loaded.'
    } catch {
      state.message = 'The profile could not be loaded.'
    } finally {
      state.isBusy = false
    }
  }

  async function create() {
    if (!validateForm()) return
    state.isBusy = true
    try {
      state.profileId = await createHomeProfile(state.form)
      state.message = `Home profile created: ${state.profileId}`
    } catch {
      state.message = 'The profile could not be created.'
    } finally {
      state.isBusy = false
    }
  }

  async function update() {
    if (!state.profileId || !validateForm()) {
      if (!state.profileId) state.message = 'Enter a profile ID to update.'
      return
    }
    state.isBusy = true
    try {
      await updateHomeProfile(state.profileId, state.form)
      state.message = 'Home profile updated.'
    } catch {
      state.message = 'The profile could not be updated.'
    } finally {
      state.isBusy = false
    }
  }

  async function remove() {
    if (!state.profileId) {
      state.message = 'Enter a profile ID to delete.'
      return
    }
    state.isBusy = true
    try {
      await deleteHomeProfile(state.profileId)
      state.message = 'Home profile deleted.'
      state.profileId = ''
      Object.assign(state.form, emptyForm())
    } catch {
      state.message = 'The profile could not be deleted.'
    } finally {
      state.isBusy = false
    }
  }

  async function assignTile() {
    if (!state.profileId || !state.tileId) {
      state.message = 'Enter both profile and tile IDs.'
      return
    }
    state.isBusy = true
    try {
      await assignPortfolioTileToProfile(state.profileId, state.tileId)
      state.message = 'Portfolio tile assigned.'
    } catch {
      state.message = 'The tile could not be assigned.'
    } finally {
      state.isBusy = false
    }
  }

  async function removeTile() {
    if (!state.profileId || !state.tileId) {
      state.message = 'Enter both profile and tile IDs.'
      return
    }
    state.isBusy = true
    try {
      await removePortfolioTileFromProfile(state.profileId, state.tileId)
      state.message = 'Portfolio tile removed from profile.'
    } catch {
      state.message = 'The tile could not be removed.'
    } finally {
      state.isBusy = false
    }
  }

  return { state, load, create, update, remove, assignTile, removeTile }
}
