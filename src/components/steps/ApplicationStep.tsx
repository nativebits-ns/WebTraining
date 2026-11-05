import { LIMITS } from '../../schemas/jobApplication'
import { positionOptions } from '../../schemas/options'
import { CheckboxField, SelectField, TextAreaField, TextField } from '../fields'

export function ApplicationStep() {
  return (
    <div className="space-y-4">
      <SelectField
        name="application.position"
        label="Position applied for"
        options={positionOptions}
      />
      <TextField
        name="application.expectedJoiningDate"
        label="Expected joining date"
        type="date"
      />
      <TextField
        name="application.portfolioUrl"
        label="Portfolio link"
        type="url"
        inputMode="url"
        autoComplete="url"
        optional
      />
      <TextAreaField
        name="application.coverNote"
        label="Cover note"
        limit={LIMITS.coverNote}
        optional
      />
      <CheckboxField
        name="application.acceptedTerms"
        label="I confirm the details are correct and accept the terms and conditions"
      />
    </div>
  )
}
