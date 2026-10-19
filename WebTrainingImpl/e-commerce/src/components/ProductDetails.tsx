import { useCallback, useState } from 'react'
import type { Product } from '../types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface ProductDetailsProps {
  product: Product
  canBuy: boolean
  isAdding: boolean
  error: string | null
  onAdd: (product: Product) => void
  onBack: () => void
  onRequestRegister: () => void
}

export default function ProductDetails({
  product,
  canBuy,
  isAdding,
  error,
  onAdd,
  onBack,
  onRequestRegister,
}: ProductDetailsProps) {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)

  const observeImage = useCallback((element: HTMLDivElement) => {
    const observer = new ResizeObserver(([entry]) => {
      setImageSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      })
    })
    observer.observe(element)
    console.debug('[ref] ResizeObserver attached')

    return () => {
      observer.disconnect()
      console.debug('[ref cleanup] ResizeObserver disconnected')
    }
  }, [])

  return (
    <section aria-labelledby="product-details-title" className="rounded-2xl border border-slate-200 bg-white p-5">
      <button type="button" onClick={onBack} className="text-sm text-blue-700">
        ← Back to products
      </button>

      <div className="mt-4 grid gap-6 grid-cols-2">
        <div>
          <div ref={observeImage} className="rounded-2xl bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {product.category}
          </span>
          <h2 id="product-details-title" className="text-2xl font-bold">
            {product.name}
          </h2>
          <p className="text-2xl font-semibold">{currency.format(product.price)}</p>
          <p className="text-slate-600">{product.description}</p>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">
              {error}
            </p>
          )}

          {canBuy ? (
            <button
              type="button"
              disabled={isAdding}
              onClick={() => onAdd(product)}
              className="mt-2 w-fit rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:cursor-wait disabled:bg-blue-400"
            >
              {isAdding ? 'Adding…' : 'Add to cart'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onRequestRegister}
              className="mt-2 w-fit rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white"
            >
              Register to add
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
