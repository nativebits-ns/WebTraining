import type { Product } from '../types.ts'
import Button from './Button.tsx'
import StatusBadge from './StatusBadge.tsx'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductCard = ({ product }: { product: Product }) => {
  const isOutOfStock = product.status === 'Out of stock'

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-200 hover:border-zinc-300 hover:shadow-md">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-104"
        />

        <div className="absolute left-3 top-3">
          <StatusBadge status={product.status} />
        </div>

        <button
          type="button"
          aria-label="Save item"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-zinc-600 opacity-0 shadow-xs backdrop-blur-xs transition hover:bg-white hover:text-zinc-900 group-hover:opacity-100"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            {product.category}
          </span>
          <span className="text-xs text-zinc-400 font-mono">#{product.id.toString().padStart(4, '0')}</span>
        </div>

        <h3 className="line-clamp-1 font-semibold text-zinc-900 group-hover:text-amber-900 transition-colors">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <span className="text-base font-bold text-zinc-900">
            {priceFormatter.format(product.price)}
          </span>

          <Button
            variant={isOutOfStock ? 'secondary' : 'primary'}
            disabled={isOutOfStock}
            className="h-8 px-3 text-xs"
          >
            {isOutOfStock ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard