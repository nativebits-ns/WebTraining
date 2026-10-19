import { useActionState, useId, type Ref } from 'react'
import { useFormStatus } from 'react-dom'
import { registerUser } from '../api/register'
import { useUser } from '../context/UserContext'
import type { FieldErrors } from '../types'
import { validateRegistration } from '../validation'
import TextInput from './TextInput'

interface RegisterState {
  status: 'idle' | 'error' | 'success'
  message: string | null
  errors: FieldErrors
  values: { name: string; email: string }
}

const initialState: RegisterState = {
  status: 'idle',
  message: null,
  errors: {},
  values: { name: '', email: '' },
}

interface FieldProps {
  label: string
  name: 'name' | 'email' | 'password'
  type: 'text' | 'email' | 'password'
  autoComplete: string
  defaultValue?: string
  error?: string
  inputRef?: Ref<HTMLInputElement>
}

function Field({ label, name, type, autoComplete, defaultValue, error, inputRef }: FieldProps) {
  const { pending } = useFormStatus()
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <TextInput
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        readOnly={pending}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 read-only:bg-slate-50 ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:bg-blue-400"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  )
}

export default function RegisterForm({ nameInputRef }: { nameInputRef?: Ref<HTMLInputElement> }) {
  const { setUser } = useUser()

  const [state, formAction] = useActionState<RegisterState, FormData>(async (_prev, formData) => {
    const values = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    }

    const errors = validateRegistration(values)
    if (Object.keys(errors).length > 0) {
      return {
        status: 'error',
        message: 'Error in field. Fix to proceed',
        errors,
        values: { name: values.name, email: values.email },
      }
    }

    const result = await registerUser({ name: values.name, email: values.email })

    if (!result.ok) {
      return {
        status: 'error',
        message: result.error,
        errors: { email: result.error },
        values: { name: values.name, email: values.email },
      }
    }

    setUser(result.user)
    return {
      status: 'success',
      message: `Welcome, ${result.user.name}! Enjoy shopping.`,
      errors: {},
      values: { name: '', email: '' },
    }
  }, initialState)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Create your account</h2>
      <p className="mt-1 text-sm text-slate-600">Register to start adding products to your cart.</p>

      {state.status === 'success' && state.message && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.message}
        </p>
      )}
      {state.status === 'error' && state.message && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">
          {state.message}
        </p>
      )}

      <form action={formAction} noValidate className="mt-4 space-y-4">
        <Field label="Name" name="name" type="text" autoComplete="name" inputRef={nameInputRef} defaultValue={state.values.name} error={state.errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.values.email} error={state.errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="new-password" error={state.errors.password} />
        <SubmitButton />
      </form>
    </section>
  )
}
