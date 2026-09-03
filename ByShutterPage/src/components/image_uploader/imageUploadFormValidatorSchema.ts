import { z } from 'zod';

const imageUploadSchema = z.object({
    file: z.custom<File>(val => val instanceof File, "Image is required."),
    displayName: z.string().min(3, "Name must be at least 3 characters long."),
    mediaAlt: z.string().min(1, "Alternative text is required"),
    description: z.string().nullable()
});

export default imageUploadSchema;