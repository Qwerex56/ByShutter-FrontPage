export interface PhotoPreviewModel {
    id: string,
    name: string,
    displayName?: string | null,
    description?: string | null,
    source: string,
    imageAlt: string
};

export interface PhotoPreviewEvents {
    (e: 'openBigPicture') : void,
    (e: 'edit', id: string) : void,
    (e: 'delete', id: string) : void
}