import { z } from 'zod'

export const portfolioTileFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  imageId: z.string().uuid('Enter a valid image ID.'),
  description: z.string().max(256, 'Description cannot exceed 256 characters.'),
})
