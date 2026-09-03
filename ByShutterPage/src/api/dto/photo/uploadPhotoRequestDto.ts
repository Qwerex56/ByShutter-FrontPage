export interface UploadPhotoRequestDto {
    file: File
    fileName?: string | null
    mediaAlt?: string | null
    displayName?: string | null
    description?: string | null
}