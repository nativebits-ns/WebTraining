import type { ComponentProps } from 'react'

export default function TextInput({ ref, ...props }: ComponentProps<'input'>) {
  return <input ref={ref} {...props} />
}
