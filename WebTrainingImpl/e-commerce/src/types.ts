export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
}

export interface User {
  id: string
  name: string
  email: string
  registeredAt: string
}

export interface FieldErrors {
  name?: string
  email?: string
  password?: string
}
