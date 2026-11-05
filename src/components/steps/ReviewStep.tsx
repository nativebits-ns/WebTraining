import { useState, type ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatDate } from '../../lib/dates'
import { applicationSchema, type ApplicationData } from '../../schemas/jobApplication'
import { NOTICE_PERIOD_LABELS } from '../../schemas/options'
import { buttonClass } from '../fields'
import type { StepProps } from './types'

function Section({
  title,
  step,
  onEdit,
  children,
}: {
  title: string
  step: number
  onEdit: (step: number) => void
  children: ReactNode
}) {
  return (
    <section className="rounded border border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onEdit(step)}
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          Edit
        </button>
      </div>
      <dl className="mt-3 space-y-2">{children}</dl>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <dt className="text-gray-600">{label}</dt>
      <dd className="col-span-2 break-words">{value || '—'}</dd>
    </div>
  )
}

export function ReviewStep({ onEdit }: StepProps) {
  const { getValues } = useFormContext<ApplicationData>()
  const [result] = useState(() => applicationSchema.safeParse(getValues()))

  if (!result.success) {
    return (
      <p role="alert" className="text-sm text-red-700">
        Some answers are missing or invalid. Please go back and check each step.
      </p>
    )
  }

  const { personal, education, experience, application } = result.data

  return (
    <div className="space-y-4">
      <Section title="Personal details" step={0} onEdit={onEdit}>
        <Row label="Full name" value={personal.fullName} />
        <Row label="Email" value={personal.email} />
        <Row label="Phone" value={personal.phone} />
        <Row label="Date of birth" value={formatDate(personal.dateOfBirth)} />
        <Row label="Current city" value={personal.city} />
      </Section>

      <Section title="Education" step={1} onEdit={onEdit}>
        {education.map((entry, index) => (
          <Row
            key={index}
            label={`Qualification ${index + 1}`}
            value={`${entry.degree}, ${entry.institution} (${entry.yearOfPassing}) — ${entry.percentage}%`}
          />
        ))}
      </Section>

      <Section title="Experience" step={2} onEdit={onEdit}>
        {experience.candidateType === 'fresher' ? (
          <>
            <Row label="Status" value="Fresher" />
            <Row label="Available from" value={formatDate(experience.availabilityDate)} />
          </>
        ) : (
          <>
            <Row label="Status" value="Experienced" />
            <Row label="Total experience" value={`${experience.totalExperience} years`} />
            <Row label="Notice period" value={NOTICE_PERIOD_LABELS[experience.noticePeriod]} />
            {experience.companies.map((company, index) => (
              <Row
                key={index}
                label={`Company ${index + 1}`}
                value={`${company.role}, ${company.companyName} (${formatDate(company.from)} – ${formatDate(company.to)})`}
              />
            ))}
          </>
        )}
      </Section>

      <Section title="Application details" step={3} onEdit={onEdit}>
        <Row label="Position" value={application.position} />
        <Row label="Expected joining" value={formatDate(application.expectedJoiningDate)} />
        <Row label="Portfolio" value={application.portfolioUrl} />
        <Row label="Cover note" value={application.coverNote} />
        <Row label="Terms accepted" value="Yes" />
      </Section>
    </div>
  )
}
