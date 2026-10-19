import { use } from 'react'
import type { Product } from '../types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface ProductListProps {
  productsPromise: Promise<Product[]>
  canBuy: boolean
  onAdd: (product: Product) => void
  onSelect: (product: Product) => void
}

export default function ProductList({ productsPromise, canBuy, onAdd, onSelect }: ProductListProps) {
  const products = use(productsPromise)

  if (products.length === 0) {
    return <p className="text-slate-600">No products are available right now.</p>
  }

  return (
    <ul className="grid gap-5 grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => onSelect(product)}
              aria-label={`View details for ${product.name}`}
            >
              <img
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="aspect-square w-full bg-slate-100 rounded-2xl"
              />
            </button>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {product.category}
              </span>
              <h3 className="text-base font-semibold">
                <button
                  type="button"
                  onClick={() => onSelect(product)}
                  className="text-left hover:text-blue-700 hover:underline"
                >
                  {product.name}
                </button>
              </h3>
              <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                <span className="text-lg font-semibold">{currency.format(product.price)}</span>
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => onAdd(product)}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {canBuy ? 'Add to cart' : 'Register to add'}
                </button>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
