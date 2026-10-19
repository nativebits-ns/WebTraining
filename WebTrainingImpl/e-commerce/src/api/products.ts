import type { Product } from '../types'

const API_URL =
  'https://dummyjson.com/products?limit=12&select=title,description,category,price,thumbnail'

interface DummyProduct {
  id: number
  title: string
  description: string
  category: string
  price: number
  thumbnail: string
}

interface DummyProductsResponse {
  products: DummyProduct[]
}

function formatCategory(slug: string): string {
  const text = slug.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export async function fetchProducts(options: { shouldFail?: boolean } = {}): Promise<Product[]> {
  if (options.shouldFail) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    throw new Error('Simulated failure: the product service is unavailable.')
  }

  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`Couldn’t load products (HTTP ${response.status}).`)
  }

  const data: DummyProductsResponse = await response.json()

  return data.products.map((p) => ({
    id: p.id,
    name: p.title,
    price: p.price,
    category: formatCategory(p.category),
    image: p.thumbnail,
    description: p.description,
  }))
}
