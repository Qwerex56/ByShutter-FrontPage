export interface AddPhotosToAlbumModel {
  albumId: string
}

export interface AddPhotosToAlbumEvents {
  (e: 'close'): void
  (e: 'saveChanges', photoIds: string[]): void
}
