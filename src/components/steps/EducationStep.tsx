import { useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { emptyEducation, type ApplicationData } from '../../schemas/jobApplication'
import { ArrayError, TextField, buttonClass } from '../fields'

export function EducationStep() {
  const { control } = useFormContext<ApplicationData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'education' })
  const addRef = useRef<HTMLButtonElement>(null)

  const handleRemove = (index: number) => {
    remove(index)
    addRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <ArrayError name="education" />

      {fields.map((field, index) => (
        <fieldset key={field.id} className="space-y-3 rounded border border-gray-300 p-4">
          <legend className="px-1 text-sm font-semibold">
            Qualification {index + 1}
          </legend>
          <TextField name={`education.${index}.degree`} label="Degree" />
          <TextField name={`education.${index}.institution`} label="Institution" />
          <TextField
            name={`education.${index}.yearOfPassing`}
            label="Year of passing"
            inputMode="numeric"
          />
          <TextField
            name={`education.${index}.percentage`}
            label="Percentage"
            inputMode="decimal"
          />
          {fields.length > 1 && (
            <button
              type="button"
              className={buttonClass}
              onClick={() => handleRemove(index)}
              aria-label={`Remove qualification ${index + 1}`}
            >
              Remove
            </button>
          )}
        </fieldset>
      ))}

      <button
        ref={addRef}
        type="button"
        className={buttonClass}
        onClick={() => append(emptyEducation)}
      >
        Add another qualification
      </button>
    </div>
  )
}
