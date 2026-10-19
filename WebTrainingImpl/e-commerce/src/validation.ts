import type { FieldErrors } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegistration(values: {
  name: string
  email: string
  password: string
}): FieldErrors {
  const errors: FieldErrors = {}

  if (values.name.length < 2) {
    errors.name = 'Enter your name (at least 2 characters).'
  }
  if (!values.email) {
    errors.email = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email address'
  }
  if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = 'Include at least one letter and one number.'
  }

  return errors
}
