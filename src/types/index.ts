import { DegreeLevel, ParseStatus, PurchaseStatus, EntitlementStatus, Role } from '@prisma/client'

// Profile types
export interface PersonalInfo {
  firstName: string
  lastName: string
  birthYear: number
  citizenship: string
  residence: string
  email: string
  phone?: string
}

export interface BachelorEducation {
  highSchoolName: string
  graduationYear: number
  gpa: number
  gpaScale: 'percentage' | 'gpa4'
  fieldOfStudy: string
}

export interface MasterEducation {
  universityName: string
  department: string
  startYear: number
  endYear: number
  gpa: number
  gpaScale: 'percentage' | 'gpa4'
  courseAreas?: string[]
}

export interface DoubleMajorInfo {
  hasDoubleMajor: boolean
  majorName?: string
  minorName?: string
  details?: string
}

export interface TestScore {
  type: string
  score: number
  dateOfTest?: string
  required?: boolean
  notes?: string
}

export interface TestsInfo {
  languageTests: TestScore[]
  standardizedTests: TestScore[]
}

export interface Experience {
  type: 'internship' | 'fulltime' | 'parttime'
  company: string
  role: string
  sector: string
  startDate: string
  endDate?: string
  description?: string
}

export interface Project {
  title: string
  description?: string
  link?: string
  role?: string
  technologies?: string[]
  area?: string
}

export interface GoalsInfo {
  targetFields: string[]
  preferredCountries?: string[]
  preferredCities?: string[]
  motivation?: string
}

export interface PreferencesInfo {
  budgetMin: number
  budgetMax: number
  needsScholarship: boolean
  programLanguages: string[]
  resultCount: number
}

// Profile full
export interface ProfileData {
  mode: DegreeLevel
  personal?: PersonalInfo
  education?: BachelorEducation | MasterEducation
  doubleMajor?: DoubleMajorInfo
  tests?: TestsInfo
  experiences?: Experience[]
  projects?: Project[]
  goals?: GoalsInfo
  preferences?: PreferencesInfo
  selectedCountries: string[]
  selectedLanguages: string[]
  requestedCount: number
}

// Document parsing
export interface ParsedDocument {
  extractedFields: {
    name?: string
    email?: string
    phone?: string
    university?: string
    degree?: string
    gpa?: number
    graduationYear?: number
    skills?: string[]
    experiences?: Partial<Experience>[]
    projects?: Partial<Project>[]
    languages?: string[]
  }
  confidence: number
  rawText: string
}

// Match results
export interface MatchResultData {
  programId: string
  universityName: string
  programName: string
  country: string
  language: string
  similarityScore: number
  preScore: number
  llmScore: number
  finalScore: number
  rank: number
  llmAnalysis?: LLMAnalysis
}

export interface LLMAnalysis {
  admissionProbability: number
  strengths: string[]
  weaknesses: string[]
  expertCommentary: string
  cityInsights?: string
  tuitionInfo?: string
  rankingQs?: number | null
  tag: 'SAFE' | 'TARGET' | 'REACH'
}

// API responses
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Country types
export interface Country {
  id: string
  name: string
  code: string
  flag: string
  available: boolean
  description: string
  gradient: string
}

// Program types
export interface ProgramData {
  id: string
  country: string
  degreeLevel: DegreeLevel
  universityName: string
  programName: string
  language: string
  description?: string | null
  keywords: string[]
  tuitionInfo?: string | null
  rankingQs?: number | null
}

// Excel import
export interface ExcelProgram {
  university_name: string
  program_name: string
  language: string
  description?: string
  keywords?: string
  tuition_info?: string
  ranking_qs?: number
}

// Session user
export interface SessionUser {
  id: string
  email: string
  role: Role
}

export type { DegreeLevel, ParseStatus, PurchaseStatus, EntitlementStatus, Role }
