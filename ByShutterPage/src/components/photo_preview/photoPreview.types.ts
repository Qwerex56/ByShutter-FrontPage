export interface PhotoPreviewModel {
  id: string
  name: string
  displayName?: string | null
  description?: string | null
  source: string
  imageAlt: string
  isSelcted?: boolean
}

export interface PhotoPreviewEvents {
  (e: 'select', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}
