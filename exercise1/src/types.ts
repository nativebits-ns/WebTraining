export type ProductStatus = 'In stock' | 'Low stock' | 'Out of stock'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  status: ProductStatus
  image: string
}
