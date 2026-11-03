import { style } from '@vanilla-extract/css'
import { vars } from './styles/theme.css'

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  padding: vars.space.md,
  '@media': { '(min-width: 768px)': { padding: vars.space.xl } },
})

export const container = style({
  maxWidth: '960px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
})

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const heading = style({
  margin: 0,
  fontFamily: vars.font.heading,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
})

export const section = style({ display: 'flex', flexDirection: 'column', gap: vars.space.md })

export const row = style({ display: 'flex', flexWrap: 'wrap', gap: vars.space.sm, alignItems: 'center' })

export const grid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: '1fr',
  '@media': {
    '(min-width: 600px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
    '(min-width: 960px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
  },
})
