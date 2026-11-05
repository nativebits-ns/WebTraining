import { z } from 'zod'
import { ageOn, isValidISODate, todayISO } from '../lib/dates'
import { NOTICE_PERIOD_VALUES, POSITIONS } from './options'

export const LIMITS = {
  coverNote: 500,
  qualifications: 10,
  companies: 10,
} as const

const NAME_PATTERN = /^[\p{L}][\p{L}\s.'’-]*$/u
const MOBILE_PATTERN = /^[6-9]\d{9}$/
const WHOLE_NUMBER = /^\d+$/
const DECIMAL_NUMBER = /^\d+(\.\d{1,2})?$/
const YEAR = /^\d{4}$/

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`)

const dateField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => v === '' || isValidISODate(v), 'Enter a valid date')

const numericField = (
  label: string,
  { min, max, decimals = false }: { min: number; max: number; decimals?: boolean },
) => {
  const pattern = decimals ? DECIMAL_NUMBER : WHOLE_NUMBER
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine(
      (v) => v === '' || pattern.test(v),
      decimals
        ? `${label} must be a number (up to 2 decimals)`
        : `${label} must be a whole number`,
    )
    .refine(
      (v) => !pattern.test(v) || (Number(v) >= min && Number(v) <= max),
      `${label} must be between ${min} and ${max}`,
    )
}

export const personalSchema = z.object({
  fullName: requiredText('Full name', 80)
    .min(2, 'Full name must be at least 2 characters')
    .regex(NAME_PATTERN, 'Use letters, spaces, dots, apostrophes or hyphens only'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .pipe(z.email('Enter a valid email address')),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(MOBILE_PATTERN, 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9'),
  dateOfBirth: dateField('Date of birth')
    .refine(
      (v) => !isValidISODate(v) || ageOn(v, todayISO()) >= 18,
      'You must be at least 18 years old to apply',
    )
    .refine(
      (v) => !isValidISODate(v) || ageOn(v, todayISO()) <= 100,
      'Enter a valid date of birth',
    ),
  city: requiredText('Current city', 60),
})

export const educationEntrySchema = z.object({
  degree: requiredText('Degree', 80),
  institution: requiredText('Institution', 120),
  yearOfPassing: z
    .string()
    .trim()
    .min(1, 'Year of passing is required')
    .refine((v) => v === '' || YEAR.test(v), 'Enter a 4-digit year')
    .refine(
      (v) =>
        !YEAR.test(v) ||
        (Number(v) >= 1970 && Number(v) <= new Date().getFullYear() + 4),
      'Year must be between 1970 and four years from now',
    ),
  percentage: numericField('Percentage', { min: 0, max: 100, decimals: true }),
})

export const companySchema = z
  .object({
    companyName: requiredText('Company name', 100),
    role: requiredText('Role', 80),
    from: dateField('From date'),
    to: dateField('To date').refine(
      (v) => !isValidISODate(v) || v <= todayISO(),
      'To date cannot be in the future',
    ),
  })
  .refine(
    (c) => !isValidISODate(c.from) || !isValidISODate(c.to) || c.to > c.from,
    { path: ['to'], error: 'To date must be after the from date' },
  )

const fresherSchema = z.object({
  candidateType: z.literal('fresher'),
  availabilityDate: dateField('Availability date').refine(
    (v) => !isValidISODate(v) || v >= todayISO(),
    'Availability date cannot be in the past',
  ),
})

const experiencedSchema = z.object({
  candidateType: z.literal('experienced'),
  totalExperience: numericField('Total experience', {
    min: 0,
    max: 50,
    decimals: true,
  }),
  noticePeriod: z.enum(NOTICE_PERIOD_VALUES, {
    error: 'Select your notice period',
  }),
  companies: z
    .array(companySchema)
    .min(1, 'Add at least one previous company')
    .max(LIMITS.companies, `You can add up to ${LIMITS.companies} companies`),
})

export const experienceSchema = z.discriminatedUnion(
  'candidateType',
  [fresherSchema, experiencedSchema],
  { error: 'Select whether you are a fresher or experienced' },
)

export const applicationDetailsSchema = z.object({
  position: z.enum(POSITIONS, {
    error: 'Select the position you are applying for',
  }),
  expectedJoiningDate: dateField('Expected joining date').refine(
    (v) => !isValidISODate(v) || v > todayISO(),
    'Expected joining date must be in the future',
  ),
  portfolioUrl: z.union(
    [z.literal(''), z.url({ protocol: /^https?$/ })],
    { error: 'Enter a valid link starting with http:// or https://' },
  ),
  coverNote: z
    .string()
    .trim()
    .max(LIMITS.coverNote, `Cover note must be at most ${LIMITS.coverNote} characters`),
  acceptedTerms: z.boolean().refine((v) => v, 'You must accept the terms to apply'),
})

export const applicationSchema = z
  .object({
    personal: personalSchema,
    education: z
      .array(educationEntrySchema)
      .min(1, 'Add at least one qualification')
      .max(LIMITS.qualifications, `You can add up to ${LIMITS.qualifications} qualifications`),
    experience: experienceSchema,
    application: applicationDetailsSchema,
  })
  .superRefine((data, ctx) => {
    const dob = data.personal.dateOfBirth
    if (isValidISODate(dob)) {
      const birthYear = Number(dob.slice(0, 4))

      data.education.forEach((entry, index) => {
        if (YEAR.test(entry.yearOfPassing) && Number(entry.yearOfPassing) < birthYear + 15) {
          ctx.addIssue({
            code: 'custom',
            path: ['education', index, 'yearOfPassing'],
            message: 'Year of passing is too early for your date of birth',
          })
        }
      })

      if (
        data.experience.candidateType === 'experienced' &&
        DECIMAL_NUMBER.test(data.experience.totalExperience)
      ) {
        const workingYears = Math.max(ageOn(dob, todayISO()) - 15, 0)
        if (Number(data.experience.totalExperience) > workingYears) {
          ctx.addIssue({
            code: 'custom',
            path: ['experience', 'totalExperience'],
            message: `Total experience can't be more than ${workingYears} years for your date of birth`,
          })
        }
      }
    }

    if (data.experience.candidateType === 'experienced') {
      const ends = data.experience.companies
        .map((c) => c.to)
        .filter((to) => isValidISODate(to))
        .sort()
      const lastEnd = ends[ends.length - 1]
      const joining = data.application.expectedJoiningDate
      if (lastEnd && isValidISODate(joining) && joining <= lastEnd) {
        ctx.addIssue({
          code: 'custom',
          path: ['application', 'expectedJoiningDate'],
          message: 'Joining date must be after your last employment end date',
        })
      }
    }
  })

export type ApplicationData = z.infer<typeof applicationSchema>
export type EducationEntry = z.infer<typeof educationEntrySchema>
export type Company = z.infer<typeof companySchema>

export const emptyEducation: EducationEntry = {
  degree: '',
  institution: '',
  yearOfPassing: '',
  percentage: '',
}

export const emptyCompany: Company = {
  companyName: '',
  role: '',
  from: '',
  to: '',
}

export const defaultValues = {
  personal: { fullName: '', email: '', phone: '', dateOfBirth: '', city: '' },
  education: [emptyEducation],
  experience: {
    candidateType: 'fresher' as const,
    availabilityDate: '',
    totalExperience: '',
    companies: [emptyCompany],
  },
  application: {
    portfolioUrl: '',
    expectedJoiningDate: '',
    coverNote: '',
    acceptedTerms: false,
  },
}
