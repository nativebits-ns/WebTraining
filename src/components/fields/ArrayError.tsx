import { get, useFormState, type FieldError } from 'react-hook-form'

type ArrayErrorShape = { root?: FieldError; message?: string }

export function ArrayError({ name }: { name: 'education' | 'experience.companies' }) {
  const { errors } = useFormState({ name })
  const error = get(errors, name) as ArrayErrorShape | undefined
  const message = error?.root?.message ?? error?.message
  if (!message) return null

  return (
    <p
      role="alert"
      tabIndex={-1}
      data-array-error
      className="text-sm text-red-700"
    >
      {message}
    </p>
  )
}
