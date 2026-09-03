import { z } from 'zod'

const albumUploadSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().nullable(),
})

export default albumUploadSchema
