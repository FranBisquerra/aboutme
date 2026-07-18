import {z} from 'zod'

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  linkedin: z.string().min(1, 'LinkedIn is required'),
  github: z.string().min(1, 'GitHub is required'),
  bio: z.string().min(1, 'Bio is required'),
})
