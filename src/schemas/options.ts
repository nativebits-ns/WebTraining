export const POSITIONS = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full-Stack Engineer',
  'QA Engineer',
  'UI/UX Designer',
  'Product Manager',
] as const

export const NOTICE_PERIOD_VALUES = ['immediate', '15', '30', '60', '90'] as const

export const NOTICE_PERIOD_LABELS: Record<
  (typeof NOTICE_PERIOD_VALUES)[number],
  string
> = {
  immediate: 'Immediate',
  '15': '15 days',
  '30': '30 days',
  '60': '60 days',
  '90': '90 days',
}

export const positionOptions = POSITIONS.map((p) => ({ value: p, label: p }))

export const noticePeriodOptions = NOTICE_PERIOD_VALUES.map((v) => ({
  value: v,
  label: NOTICE_PERIOD_LABELS[v],
}))
