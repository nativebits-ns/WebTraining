import { useUser } from '../context/UserContext'

export default function UserProfile() {
  const { user } = useUser()

  if (!user) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 p-5">
        <h2 className="text-lg font-semibold">Not Login yet</h2>
        <p className="mt-1 text-sm text-slate-600">If not registered yet. Register now.</p>
      </section>
    )
  }

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">User Details</h2>
      <div className="mt-4 flex items-center gap-3">
        <div aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-sm text-slate-600">{user.email}</p>
        </div>
      </div>
    </section>
  )
}
