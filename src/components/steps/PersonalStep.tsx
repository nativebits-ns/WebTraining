import { TextField } from '../fields'

export function PersonalStep() {
  return (
    <div className="space-y-4">
      <TextField name="personal.fullName" label="Full name" autoComplete="name" />
      <TextField
        name="personal.email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <TextField
        name="personal.phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        hint="10-digit mobile number"
      />
      <TextField
        name="personal.dateOfBirth"
        label="Date of birth"
        type="date"
        autoComplete="bday"
      />
      <TextField
        name="personal.city"
        label="Current city"
        autoComplete="address-level2"
      />
    </div>
  )
}
