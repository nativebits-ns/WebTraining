import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
} from 'react'
import {
  FormProvider,
  useForm,
  useFormState,
  type SubmitHandler,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ApiValidationError,
  submitApplication,
} from '../api/submitApplication'
import {
  applicationSchema,
  defaultValues,
  type ApplicationData,
} from '../schemas/jobApplication'
import { buttonClass, primaryButtonClass } from './fields'
import { ApplicationStep } from './steps/ApplicationStep'
import { EducationStep } from './steps/EducationStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { PersonalStep } from './steps/PersonalStep'
import { ReviewStep } from './steps/ReviewStep'
import type { StepProps } from './steps/types'
import { StepIndicator } from './StepIndicator'
import { SubmissionSuccess } from './SubmissionSuccess'

type StepConfig = {
  title: string
  validates?: 'personal' | 'education' | 'experience' | 'application'
  Component: ComponentType<StepProps>
}

const STEPS: readonly StepConfig[] = [
  { title: 'Personal details', validates: 'personal', Component: PersonalStep },
  { title: 'Education', validates: 'education', Component: EducationStep },
  { title: 'Experience', validates: 'experience', Component: ExperienceStep },
  { title: 'Application details', validates: 'application', Component: ApplicationStep },
  { title: 'Review & submit', Component: ReviewStep },
]

const LAST_INPUT_STEP = STEPS.length - 2
const REVIEW_STEP = STEPS.length - 1
const STEP_TITLES = STEPS.map((s) => s.title)

type Outcome =
  | { kind: 'idle' }
  | { kind: 'success'; referenceId: string }
  | { kind: 'rejected' }
  | { kind: 'server-error' }

type FocusRequest = { target: 'heading' | 'invalid' } | null

function SubmitButton() {
  const { isSubmitting } = useFormState()
  return (
    <>
      {isSubmitting && (
        <p role="status" className="text-sm text-gray-600">
          Submitting your application…
        </p>
      )}
      <button
        type="submit"
        className={primaryButtonClass}
        aria-disabled={isSubmitting}
        onClick={(event) => {
          if (isSubmitting) event.preventDefault()
        }}
      >
        {isSubmitting ? 'Submitting…' : 'Submit application'}
      </button>
    </>
  )
}

export function JobApplicationWizard() {
  const methods = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const [step, setStep] = useState(0)
  const [outcome, setOutcome] = useState<Outcome>({ kind: 'idle' })
  const [focusRequest, setFocusRequest] = useState<FocusRequest>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const frame = requestAnimationFrame(() => {
      const firstInvalid =
        focusRequest.target === 'invalid'
          ? panelRef.current?.querySelector<HTMLElement>(
              '[aria-invalid="true"], [data-array-error]',
            )
          : null
      ;(firstInvalid ?? headingRef.current)?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [focusRequest])

  const firstInvalidStep = () =>
    STEPS.findIndex(
      (s) => s.validates !== undefined && methods.getFieldState(s.validates).invalid,
    )

  const jumpToInvalid = () => {
    const index = firstInvalidStep()
    if (index >= 0) setStep(index)
    setFocusRequest({ target: 'invalid' })
  }

  const goTo = (index: number) => {
    setStep(index)
    setFocusRequest({ target: 'heading' })
  }

  const goNext = async () => {
    const { validates } = STEPS[step]
    setOutcome((o) => (o.kind === 'success' ? o : { kind: 'idle' }))

    const valid =
      step === LAST_INPUT_STEP
        ? await methods.trigger()
        : validates
          ? await methods.trigger(validates)
          : true

    if (!valid) return jumpToInvalid()
    goTo(step + 1)
  }

  const goBack = () => goTo(step - 1)

  const onValid: SubmitHandler<ApplicationData> = async (data) => {
    setOutcome({ kind: 'idle' })
    try {
      const { referenceId } = await submitApplication(data)
      setOutcome({ kind: 'success', referenceId })
    } catch (error) {
      if (error instanceof ApiValidationError) {
        error.fieldErrors.forEach(({ path, message }) =>
          methods.setError(path, { type: 'server', message }),
        )
        setOutcome({ kind: 'rejected' })
        jumpToInvalid()
      } else {
        setOutcome({ kind: 'server-error' })
      }
    }
  }

  const submitReview = methods.handleSubmit(onValid, jumpToInvalid)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step === REVIEW_STEP) {
      void submitReview(event)
      return
    }
    event.preventDefault()
    void goNext()
  }

  const startOver = () => {
    methods.reset(defaultValues)
    setOutcome({ kind: 'idle' })
    setStep(0)
  }

  if (outcome.kind === 'success') {
    return <SubmissionSuccess referenceId={outcome.referenceId} onReset={startOver} />
  }

  const { title, Component } = STEPS[step]

  return (
    <FormProvider {...methods}>
      <form noValidate aria-label="Job application" onSubmit={handleSubmit} className="space-y-6">
        <StepIndicator titles={STEP_TITLES} current={step} />

        <div ref={panelRef} className="space-y-4">
          <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold">
            {title}
          </h2>

          {outcome.kind === 'rejected' && (
            <p role="alert" className="rounded border border-red-600 p-3 text-sm text-red-700">
              The server couldn’t accept some of your details. Please fix the
              highlighted fields and continue.
            </p>
          )}
          {outcome.kind === 'server-error' && (
            <p role="alert" className="rounded border border-red-600 p-3 text-sm text-red-700">
              Something went wrong on our side. Your answers are still here —
              please try submitting again.
            </p>
          )}

          <Component onEdit={goTo} />
        </div>

        <div className="flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" className={buttonClass} onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < REVIEW_STEP ? (
            <button key="next" type="submit" className={primaryButtonClass}>
              Next
            </button>
          ) : (
            <SubmitButton key="submit" />
          )}
        </div>
      </form>
    </FormProvider>
  )
}
