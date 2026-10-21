import { computed, reactive } from 'vue'
import {
  createPortfolioTile,
  deletePortfolioTile,
  getPortfolioTile,
  updatePortfolioTile,
} from '@/api/endpoints/portfolioTiles'
import type { PortfolioTileForm } from '@/types/homeConfig'
import { portfolioTileFormSchema } from './portfolioTileManager.validation'
import type { PortfolioTileManagerState } from './portfolioTileManager.types'

const emptyForm = (): PortfolioTileForm => ({ name: '', imageId: '', description: '' })

export function usePortfolioTileManager() {
  const state = reactive<PortfolioTileManagerState>({
    form: emptyForm(),
    tileId: '',
    mode: 'create',
    message: '',
    isBusy: false,
    loadedTile: null,
  })

  const isEditing = computed(() => state.mode === 'edit')

  function reset() {
    state.form = emptyForm()
    state.tileId = ''
    state.mode = 'create'
    state.message = ''
  }

  function beginEdit() {
    state.mode = 'edit'
    state.message = ''
  }

  async function load() {
    if (!state.tileId) {
      state.message = 'Enter a tile ID to load.'
      return
    }
    state.isBusy = true
    try {
      state.loadedTile = await getPortfolioTile(state.tileId)
      state.message = 'Portfolio tile loaded.'
    } catch {
      state.message = 'The tile could not be loaded.'
    } finally {
      state.isBusy = false
    }
  }

  async function save() {
    const parsed = portfolioTileFormSchema.safeParse(state.form)
    if (!parsed.success || (isEditing.value && !state.tileId)) {
      state.message = parsed.success
        ? 'Enter the tile ID to edit.'
        : (parsed.error.issues[0]?.message ?? 'Invalid tile data.')
      return
    }

    state.isBusy = true
    try {
      const payload = { ...state.form, description: state.form.description || null }
      if (isEditing.value) {
        await updatePortfolioTile(state.tileId, payload)
        state.message = 'Portfolio tile updated.'
      } else {
        const id = await createPortfolioTile(payload)
        state.tileId = id
        state.message = `Portfolio tile created: ${id}`
      }
    } catch {
      state.message = 'The operation could not be completed.'
    } finally {
      state.isBusy = false
    }
  }

  async function remove() {
    if (!state.tileId) {
      state.message = 'Enter the tile ID to delete.'
      return
    }

    state.isBusy = true
    try {
      await deletePortfolioTile(state.tileId)
      state.message = 'Portfolio tile deleted.'
      reset()
    } catch {
      state.message = 'The tile could not be deleted.'
    } finally {
      state.isBusy = false
    }
  }

  return { state, isEditing, reset, beginEdit, load, save, remove }
}
