import type { AlbumPhotoDto } from "./albumPhotoDto";

export interface AlbumDto {
    id: string
    name?: string | null
    description?: string | null
    photos?: AlbumPhotoDto[] | null
}
