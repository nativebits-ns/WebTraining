import { useEffect, useRef } from 'react'
import { buttonClass } from './fields'

export function SubmissionSuccess({
  referenceId,
  onReset,
}: {
  referenceId: string
  onReset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section className="space-y-3">
      <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold">
        Application submitted
      </h2>
      <p className="text-sm">
        Thanks! Your reference number is <strong>{referenceId}</strong>. Keep it
        handy if you need to contact us.
      </p>
      <button type="button" className={buttonClass} onClick={onReset}>
        Start a new application
      </button>
    </section>
  )
}
