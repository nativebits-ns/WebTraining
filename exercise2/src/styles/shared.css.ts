import { style } from '@vanilla-extract/css'
import { vars } from './theme.css'

export const focusRing = style({
  ':focus-visible': {
    outline: `2px solid ${vars.color.focus}`,
    outlineOffset: '2px',
  },
})

export const controlBase = style({
  fontFamily: vars.font.body,
  fontWeight: vars.fontWeight.medium,
  lineHeight: 1.2,
})
