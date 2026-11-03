import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

const variants: Record<Variant, string> = {
  primary: 'bg-zinc-900 text-white shadow-xs enabled:hover:bg-amber-900 enabled:active:bg-zinc-950',
  secondary:
    'border border-zinc-200 bg-white text-zinc-700 shadow-2xs enabled:hover:bg-zinc-50 enabled:hover:text-zinc-900',
}

const Button = ({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) => (
  <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
)

export default Button