import type { CreateUserInput, User } from '../types'

let db: User[] = [
  { id: crypto.randomUUID(), name: 'Nachiket Shilwant', email: 'nachiket@example.com', role: 'Admin' },
  { id: crypto.randomUUID(), name: 'Ayush Gupta', email: 'ayush@example.com', role: 'Editor' },
  { id: crypto.randomUUID(), name: 'Shrirang Godbole', email: 'shrirang@example.com', role: 'Viewer' },
]

export const serverControl = { shouldFail: false }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchUsers(): Promise<User[]> {
  await sleep(600)
  return structuredClone(db)
}

export async function createUser(input: CreateUserInput): Promise<User> {
  await sleep(900)
  if (serverControl.shouldFail) throw new Error('Server error: could not create the user.')
  if (db.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error(`A user with the email "${input.email}" already exists.`)
  }
  const user: User = { id: crypto.randomUUID(), ...input }
  db = [...db, user]
  return user
}

export async function deleteUser(id: string): Promise<void> {
  await sleep(1200)
  if (serverControl.shouldFail) throw new Error('Server error: could not delete the user.')
  db = db.filter((u) => u.id !== id)
}
