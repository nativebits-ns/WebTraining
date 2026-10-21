import type { SubmitEvent } from 'react'
import { useCreateUser } from '../hooks/useUsers'
import { ROLES, type Role } from '../types'
import { MutationStatus } from './MutationStatus'

const field =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100'

export function UserForm() {
  const createUser = useCreateUser()

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    createUser.mutate(
      {
        name: String(data.get('name')).trim(),
        email: String(data.get('email')).trim(),
        role: data.get('role') as Role,
      },
      { onSuccess: () => form.reset() },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Add a user</h2>

      <fieldset disabled={createUser.isPending} className="space-y-4">
        <label className="block text-sm font-medium">
          Name
          <input name="name" required placeholder="Nachiket" className={field} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Email
          <input name="email" type="email" required placeholder="nachiket@example.com" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Role
          <select name="role" defaultValue="Viewer" className={field}>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {createUser.isPending ? 'Creating…' : 'Create user'}
        </button>
      </fieldset>

      <MutationStatus
        label="Create user"
        isPending={createUser.isPending}
        isSuccess={createUser.isSuccess}
        isError={createUser.isError}
        error={createUser.error}
        pendingText="Creating user…"
        successText="User created and list refreshed."
      />
    </form>
  )
}
