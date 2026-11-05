import { useFormContext } from 'react-hook-form'
import type { ApplicationData } from '../../schemas/jobApplication'
import { FieldMessage } from './FieldParts'
import { useField, type FieldName } from './useField'

type RadioGroupFieldProps = {
  name: FieldName
  legend: string
  options: readonly { value: string; label: string }[]
}

export function RadioGroupField({ name, legend, options }: RadioGroupFieldProps) {
  const { register } = useFormContext<ApplicationData>()
  const field = useField(name)

  return (
    <fieldset aria-describedby={field.describedBy}>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="mt-1 flex gap-6">
        {options.map((option) => {
          const optionId = `${field.id}-${option.value}`
          return (
            <div key={option.value} className="flex items-center gap-2">
              <input
                {...register(name)}
                {...field.ariaProps}
                id={optionId}
                type="radio"
                value={option.value}
              />
              <label htmlFor={optionId} className="text-sm">
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
      <FieldMessage id={field.errorId} message={field.message} />
    </fieldset>
  )
}
