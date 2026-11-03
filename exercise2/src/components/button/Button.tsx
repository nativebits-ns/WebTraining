import type { ButtonHTMLAttributes } from 'react'
import { button, type ButtonVariants } from './Button.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants

export function Button({ variant, size, className, type = 'button', ...rest }: ButtonProps) {
  const classes = [button({ variant, size }), className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
