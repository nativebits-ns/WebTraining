import { useRef } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { emptyCompany, type ApplicationData } from '../../schemas/jobApplication'
import { noticePeriodOptions } from '../../schemas/options'
import {
  ArrayError,
  RadioGroupField,
  SelectField,
  TextField,
  buttonClass,
} from '../fields'

const candidateTypes = [
  { value: 'fresher', label: 'Fresher' },
  { value: 'experienced', label: 'Experienced' },
]

function FresherFields() {
  return <TextField name="experience.availabilityDate" label="Available to join from" type="date" />
}

function ExperiencedFields() {
  const { control } = useFormContext<ApplicationData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience.companies',
  })
  const addRef = useRef<HTMLButtonElement>(null)

  const handleRemove = (index: number) => {
    remove(index)
    addRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <TextField
        name="experience.totalExperience"
        label="Total experience (years)"
        inputMode="decimal"
      />
      <SelectField
        name="experience.noticePeriod"
        label="Notice period"
        options={noticePeriodOptions}
      />

      <h3 className="pt-2 text-sm font-semibold">Previous companies</h3>
      <ArrayError name="experience.companies" />

      {fields.map((field, index) => (
        <fieldset key={field.id} className="space-y-3 rounded border border-gray-300 p-4">
          <legend className="px-1 text-sm font-semibold">Company {index + 1}</legend>
          <TextField name={`experience.companies.${index}.companyName`} label="Company name" />
          <TextField name={`experience.companies.${index}.role`} label="Role" />
          <TextField name={`experience.companies.${index}.from`} label="From" type="date" />
          <TextField name={`experience.companies.${index}.to`} label="To" type="date" />
          {fields.length > 1 && (
            <button
              type="button"
              className={buttonClass}
              onClick={() => handleRemove(index)}
              aria-label={`Remove company ${index + 1}`}
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
        onClick={() => append(emptyCompany)}
      >
        Add another company
      </button>
    </div>
  )
}

function CandidateTypeFields() {
  const candidateType = useWatch<ApplicationData>({ name: 'experience.candidateType' })
  return candidateType === 'experienced' ? <ExperiencedFields /> : <FresherFields />
}

export function ExperienceStep() {
  return (
    <div className="space-y-4">
      <RadioGroupField
        name="experience.candidateType"
        legend="Are you a fresher or experienced?"
        options={candidateTypes}
      />
      <CandidateTypeFields />
    </div>
  )
}
