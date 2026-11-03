import type { Product } from '../types.ts'

const image = (seed: string) => `https://picsum.photos/seed/${seed}/600/450`

export const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 129.99, status: 'In stock', image: image('headphones') },
  { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 89.5, status: 'Low stock', image: image('keyboard') },
  { id: 3, name: '4K Monitor 27"', category: 'Displays', price: 349, status: 'In stock', image: image('monitor') },
  { id: 4, name: 'Ergonomic Mouse', category: 'Accessories', price: 49.99, status: 'Out of stock', image: image('mouse') },
  { id: 5, name: 'Smart Watch', category: 'Wearables', price: 199, status: 'In stock', image: image('watch') },
  { id: 6, name: 'Portable Speaker', category: 'Audio', price: 74.25, status: 'Low stock', image: image('speaker') },
  { id: 7, name: 'Laptop Stand', category: 'Accessories', price: 39, status: 'In stock', image: image('laptopstand') },
  { id: 8, name: 'USB-C Hub', category: 'Accessories', price: 59.9, status: 'Out of stock', image: image('usbhub') },
  { id: 9, name: 'Webcam HD', category: 'Video', price: 69.99, status: 'In stock', image: image('webcam') },
]
