import { z } from 'zod'

export const homeProfileFormSchema = z.object({
  heroMessage: z.string().trim().min(1, 'Hero message is required.'),
  greetings: z.string().trim().min(1, 'Greetings are required.'),
  quote: z.string().trim().min(1, 'Quote is required.'),
  aboutMe: z.string().trim().min(1, 'About me is required.'),
  heroImageId: z.string().uuid('Enter a valid hero image ID.'),
  profileImageId: z.string().uuid('Enter a valid profile image ID.'),
})
