import { useFormContext } from 'react-hook-form'
import type { ApplicationData } from '../../schemas/jobApplication'
import { controlClass } from './fieldStyles'
import { FieldLabel, FieldMessage } from './FieldParts'
import { useField, type FieldName } from './useField'

type SelectFieldProps = {
  name: FieldName
  label: string
  options: readonly { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({
  name,
  label,
  options,
  placeholder = 'Select…',
}: SelectFieldProps) {
  const { register } = useFormContext<ApplicationData>()
  const field = useField(name)

  return (
    <div>
      <FieldLabel htmlFor={field.id}>{label}</FieldLabel>
      <select
        {...register(name)}
        {...field.ariaProps}
        id={field.id}
        aria-required="true"
        className={controlClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldMessage id={field.errorId} message={field.message} />
    </div>
  )
}
