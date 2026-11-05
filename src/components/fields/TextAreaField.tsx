import { useFormContext, useWatch } from 'react-hook-form'
import type { ApplicationData } from '../../schemas/jobApplication'
import { controlClass } from './fieldStyles'
import { FieldHint, FieldLabel, FieldMessage } from './FieldParts'
import { useField, type FieldName } from './useField'

type TextAreaFieldProps = {
  name: FieldName
  label: string
  limit: number
  rows?: number
  optional?: boolean
}

function CharacterCount({ name, limit }: { name: FieldName; limit: number }) {
  const value = useWatch({ name }) as string | undefined
  return (
    <p aria-hidden="true" className="text-right text-xs text-gray-600">
      {value?.length ?? 0}/{limit}
    </p>
  )
}

export function TextAreaField({
  name,
  label,
  limit,
  rows = 5,
  optional,
}: TextAreaFieldProps) {
  const { register } = useFormContext<ApplicationData>()
  const field = useField(name, true)

  return (
    <div>
      <FieldLabel htmlFor={field.id} optional={optional}>
        {label}
      </FieldLabel>
      <FieldHint id={field.hintId}>Up to {limit} characters</FieldHint>
      <textarea
        {...register(name)}
        {...field.ariaProps}
        id={field.id}
        rows={rows}
        className={controlClass}
      />
      <CharacterCount name={name} limit={limit} />
      <FieldMessage id={field.errorId} message={field.message} />
    </div>
  )
}
