import type { ProductStatus } from '../types.ts'

const styles: Record<ProductStatus, { badge: string; dot: string }> = {
  'In stock': { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/60', dot: 'bg-emerald-600' },
  'Low stock': { badge: 'bg-amber-50 text-amber-800 border-amber-200/60', dot: 'bg-amber-600' },
  'Out of stock': { badge: 'bg-zinc-100 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400' },
}

const StatusBadge = ({ status }: { status: ProductStatus }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium shadow-2xs backdrop-blur-xs ${styles[status].badge}`}>
    <span className={`size-1.5 rounded-full ${styles[status].dot}`} aria-hidden="true" />
    {status}
  </span>
)

export default StatusBadge