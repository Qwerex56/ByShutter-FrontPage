export interface AlbumUploadForm {
  name: string
  description: string
}

export interface AlbumUploadEvents {
  (e: 'uploadAlbum', payload: AlbumUploadForm): void
}
