interface Props {
  label: string
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
  pendingText: string
  successText: string
}

export function MutationStatus({
  label,
  isPending,
  isSuccess,
  isError,
  error,
  pendingText,
  successText,
}: Props) {
  if (isPending) {
    return (
      <p role="status" className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
        {pendingText}
      </p>
    )
  }
  if (isError) {
    return (
      <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {label} failed: {error?.message ?? 'Unknown error'}
      </p>
    )
  }
  if (isSuccess) {
    return (
      <p role="status" className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {successText}
      </p>
    )
  }
  return null
}
