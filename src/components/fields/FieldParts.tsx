import type { ReactNode } from 'react'

export function FieldLabel({
  htmlFor,
  optional,
  children,
}: {
  htmlFor: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium">
      {children}
      {optional && <span className="font-normal text-gray-600"> (optional)</span>}
    </label>
  )
}

export function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-xs text-gray-600">
      {children}
    </p>
  )
}

export function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-700">
      {message}
    </p>
  )
}
