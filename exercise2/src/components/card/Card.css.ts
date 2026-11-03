import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'
import { vars } from '../../styles/theme.css'

export const card = recipe({
  base: {
    backgroundColor: vars.color.surface,
    color: vars.color.text,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.lg,
    boxShadow: vars.shadow.sm,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.md,
  },
  variants: {
    padding: {
      md: {
        padding: vars.space.md,
        '@media': { '(min-width: 768px)': { padding: vars.space.lg } },
      },
      lg: {
        padding: vars.space.lg,
        '@media': { '(min-width: 768px)': { padding: vars.space.xl } },
      },
    },
    elevated: {
      true: { boxShadow: vars.shadow.md },
    },
  },
  defaultVariants: { padding: 'md' },
})

export const cardTitle = style({
  margin: 0,
  fontFamily: vars.font.heading,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
})

export const cardBody = style({
  margin: 0,
  color: vars.color.textMuted,
})

export type CardVariants = NonNullable<RecipeVariants<typeof card>>
