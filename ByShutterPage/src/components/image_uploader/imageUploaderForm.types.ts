import type { MediaUploadFormModel } from "@/types/mediaUploadFormModel";

export interface ImageUploaderEvents {
    (e: "uploadFiles", files: MediaUploadFormModel[]) : void,
}