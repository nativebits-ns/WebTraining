import type { HTMLAttributes } from 'react'
import { badge, type BadgeVariants } from './Badge.css'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeVariants

export function Badge({ variant, className, ...rest }: BadgeProps) {
  const classes = [badge({ variant }), className].filter(Boolean).join(' ')
  return <span className={classes} {...rest} />
}
