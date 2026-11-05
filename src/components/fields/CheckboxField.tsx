import { useFormContext } from 'react-hook-form'
import type { ApplicationData } from '../../schemas/jobApplication'
import { FieldMessage } from './FieldParts'
import { useField, type FieldName } from './useField'

export function CheckboxField({ name, label }: { name: FieldName; label: string }) {
  const { register } = useFormContext<ApplicationData>()
  const field = useField(name)

  return (
    <div>
      <div className="flex items-start gap-2">
        <input
          {...register(name)}
          {...field.ariaProps}
          id={field.id}
          type="checkbox"
          aria-required="true"
          className="mt-1"
        />
        <label htmlFor={field.id} className="text-sm">
          {label}
        </label>
      </div>
      <FieldMessage id={field.errorId} message={field.message} />
    </div>
  )
}
