import { useState, type ReactNode } from 'react'
import type { User } from '../types'
import { UserContext } from './UserContext'

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  return <UserContext value={{ user, setUser }}>{children}</UserContext>
}
