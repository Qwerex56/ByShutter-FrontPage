export interface CreateHomeProfileRequestDto {
    heroMessage?: string | null
    greetings?: string | null
    quote?: string | null
    aboutMe?: string | null
    heroImageId: string
    profileImageId: string
}