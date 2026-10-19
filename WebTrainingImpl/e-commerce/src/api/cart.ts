import type { Product } from '../types'

export async function addToCartRequest(
  product: Product,
  options: { shouldFail?: boolean } = {},
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  if (options.shouldFail) {
    throw new Error(`Couldn't add “${product.name}” to your cart. Please try again.`)
  }
} 
