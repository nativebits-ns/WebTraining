import { useDeleteUser, useUsers } from '../hooks/useUsers'
import { MutationStatus } from './MutationStatus'

export function UserList() {
  const { data: users, isPending, isError, error, isFetching, refetch } = useUsers()
  const deleteUser = useDeleteUser()

  return (
    <section className="my-5 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Users {isFetching && !isPending && <span className="text-sm font-normal text-slate-500">(syncing…)</span>}
        </h2>
        <button
          onClick={() => refetch()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          Refresh
        </button>
      </div>

      <MutationStatus
        label="Delete user"
        isPending={deleteUser.isPending}
        isSuccess={deleteUser.isSuccess}
        isError={deleteUser.isError}
        error={deleteUser.error}
        pendingText="Deleting user… (removed locally, waiting for server)"
        successText="User deleted."
      />

      {isPending && <p className="text-sm text-slate-500">Loading users…</p>}
      {isError && <p role="alert" className="text-sm text-red-700">Could not load users: {error.message}</p>}
      {users?.length === 0 && <p className="text-sm text-slate-500">No users yet. Add one using the form.</p>}

      <ul className="divide-y divide-slate-100">
        {users?.map((user) => (
          <li key={user.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium">{user.role}</span>
              <button
                onClick={() => deleteUser.mutate(user.id)}
                aria-label={`Delete ${user.name}`}
                className="rounded-md px-2.5 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
