import type { Product } from '../types.ts'
import ProductCard from './ProductCard.tsx'

const ProductGrid = ({ products }: { products: Product[] }) => (
  <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <li key={product.id} className='m-3'>
        <ProductCard product={product} />
      </li>
    ))}
  </ul>
)

export default ProductGrid
