import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'
import { vars } from '../../styles/theme.css'
import { controlBase } from '../../styles/shared.css'

export const badge = recipe({
  base: [
    controlBase,
    {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `2px ${vars.space.sm}`,
      borderRadius: vars.radius.pill,
      fontSize: vars.fontSize.sm,
      fontWeight: vars.fontWeight.bold,
      whiteSpace: 'nowrap',
    },
  ],
  variants: {
    variant: {
      success: { backgroundColor: vars.color.successBg, color: vars.color.successText },
      warning: { backgroundColor: vars.color.warningBg, color: vars.color.warningText },
      error: { backgroundColor: vars.color.errorBg, color: vars.color.errorText },
      neutral: { backgroundColor: vars.color.neutralBg, color: vars.color.neutralText },
    },
  },
  defaultVariants: { variant: 'neutral' },
})

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>
