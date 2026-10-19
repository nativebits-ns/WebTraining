import { createContext, use } from 'react'
import type { User } from '../types'

export interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUser(): UserContextValue {
  const ctx = use(UserContext)
  if (!ctx) throw new Error('useUser must be used.')
  return ctx
}
