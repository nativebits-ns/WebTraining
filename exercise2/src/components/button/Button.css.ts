import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'
import { vars } from '../../styles/theme.css'
import { controlBase, focusRing } from '../../styles/shared.css'

export const button = recipe({
  base: [
    controlBase,
    focusRing,
    {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: vars.space.sm,
      border: '1px solid transparent',
      borderRadius: vars.radius.md,
      cursor: 'pointer',
      transition: 'background-color 120ms ease, transform 80ms ease',
      selectors: {
        '&:active:not(:disabled)': { transform: 'translateY(1px)' },
        '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
      },
      '@media': {
        '(max-width: 600px)': { minHeight: '44px' },
        '(prefers-reduced-motion: reduce)': { transition: 'none' },
      },
    },
  ],
  variants: {
    variant: {
      primary: {
        backgroundColor: vars.color.primary,
        color: vars.color.primaryText,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.primaryHover },
        },
      },
      secondary: {
        backgroundColor: vars.color.secondary,
        color: vars.color.secondaryText,
        borderColor: vars.color.border,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.secondaryHover },
        },
      },
      danger: {
        backgroundColor: vars.color.danger,
        color: vars.color.dangerText,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.dangerHover },
        },
      },
    },
    size: {
      sm: { fontSize: vars.fontSize.sm, padding: `${vars.space.xs} ${vars.space.sm}` },
      lg: { fontSize: vars.fontSize.lg, padding: `${vars.space.sm} ${vars.space.lg}` },
    },
  },
  defaultVariants: { variant: 'primary', size: 'sm' },
})

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>
