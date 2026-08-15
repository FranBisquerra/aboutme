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

const month = z.string().regex(/^\d{4}-\d{2}$/, 'Use the YYYY-MM format')
const year = z.string().regex(/^\d{4}$/, 'Use the YYYY format')

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  start: month,
  end: month.nullable(),
  description: z.string().min(1, 'Description is required'),
})

// Unlike experience, education has no "ongoing" case — the backend requires both years.
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  start: year,
  end: year,
})
