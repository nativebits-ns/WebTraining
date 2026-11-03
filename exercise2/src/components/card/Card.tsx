import type { HTMLAttributes } from 'react'
import { card, cardBody, cardTitle, type CardVariants } from './Card.css'

export type CardProps = HTMLAttributes<HTMLDivElement> & CardVariants

export function Card({ padding, elevated, className, ...rest }: CardProps) {
  const classes = [card({ padding, elevated }), className].filter(Boolean).join(' ')
  return <div className={classes} {...rest} />
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cardTitle} {...props} />
}

export function CardBody(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cardBody} {...props} />
}
