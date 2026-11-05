import { useId } from 'react'
import { get, useFormState, type FieldError, type FieldPath } from 'react-hook-form'
import type { ApplicationData } from '../../schemas/jobApplication'

export type FieldName = FieldPath<ApplicationData>

export function useField(name: FieldName, hasHint = false) {
  const id = useId()
  const { errors } = useFormState({ name })
  const error = get(errors, name) as FieldError | undefined
  const message = error?.message

  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [hasHint ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') ||
    undefined

  return {
    id,
    hintId,
    errorId,
    message,
    describedBy,
    ariaProps: {
      'aria-invalid': Boolean(error),
      'aria-describedby': describedBy,
    },
  }
}
