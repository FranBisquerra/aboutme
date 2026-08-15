export interface Language {
  name: string
  level: string
}

export interface ExperienceEntry {
  company: string
  role: string
  start: string
  end: string | null
  description: string
}

export interface EducationEntry {
  institution: string
  degree: string
  start: string
  end: string
}

export interface CourseEntry {
  institution: string
  name: string
  start: string
  end: string | null
}

export interface ProfileBasics {
  name: string
  title: string
  location: string
  email: string
  linkedin: string
  github: string
  bio: string
}

export interface Profile extends ProfileBasics {
  languages: Language[]
  skills: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  courses: CourseEntry[]
}

export type UpdateProfileRequest = Profile
