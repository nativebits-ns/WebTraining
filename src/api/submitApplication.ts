import type { FieldPath } from 'react-hook-form'
import type { ApplicationData } from '../schemas/jobApplication'

export type SubmitSuccess = { referenceId: string }
export type ServerFieldError = { path: FieldPath<ApplicationData>; message: string }

export class ApiValidationError extends Error {
  readonly fieldErrors: ServerFieldError[]

  constructor(fieldErrors: ServerFieldError[]) {
    super('The server rejected some fields')
    this.name = 'ApiValidationError'
    this.fieldErrors = fieldErrors
  }
}

export class ApiServerError extends Error {
  constructor() {
    super('Internal server error')
    this.name = 'ApiServerError'
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function submitApplication(data: ApplicationData): Promise<SubmitSuccess> {
  await wait(1500)

  const fieldErrors: ServerFieldError[] = []
  if (data.personal.email.toLowerCase().startsWith('taken@')) {
    fieldErrors.push({
      path: 'personal.email',
      message: 'An application with this email already exists',
    })
  }
  if (data.personal.phone === '9999999999') {
    fieldErrors.push({
      path: 'personal.phone',
      message: 'This phone number is linked to another applicant',
    })
  }
  if (fieldErrors.length > 0) throw new ApiValidationError(fieldErrors)

  if (data.application.coverNote.includes('simulate-error') || Math.random() < 0.2) {
    throw new ApiServerError()
  }

  return { referenceId: `JOB-${Date.now().toString(36).toUpperCase()}` }
}
