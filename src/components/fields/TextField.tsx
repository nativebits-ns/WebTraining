import { useFormContext } from 'react-hook-form'
import type { ApplicationData } from '../../schemas/jobApplication'
import { controlClass } from './fieldStyles'
import { FieldHint, FieldLabel, FieldMessage } from './FieldParts'
import { useField, type FieldName } from './useField'

type TextFieldProps = {
  name: FieldName
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'url'
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url'
  autoComplete?: string
  hint?: string
  optional?: boolean
}

export function TextField({
  name,
  label,
  type = 'text',
  inputMode,
  autoComplete,
  hint,
  optional,
}: TextFieldProps) {
  const { register } = useFormContext<ApplicationData>()
  const field = useField(name, Boolean(hint))

  return (
    <div>
      <FieldLabel htmlFor={field.id} optional={optional}>
        {label}
      </FieldLabel>
      {hint && <FieldHint id={field.hintId}>{hint}</FieldHint>}
      <input
        {...register(name)}
        {...field.ariaProps}
        id={field.id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-required={!optional}
        className={controlClass}
      />
      <FieldMessage id={field.errorId} message={field.message} />
    </div>
  )
}
