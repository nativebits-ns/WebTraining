import type { User } from '../types'

export type RegisterResult = { ok: true; user: User } | { ok: false; error: string }

export function registerUser(input: { name: string; email: string }): Promise<RegisterResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (input.email.toLowerCase() === 'email@email.com') {
        resolve({ ok: false, error: 'This email is already registered. Try another one.' })
        return
      }
      resolve({
        ok: true,
        user: {
          id: crypto.randomUUID(),
          name: input.name,
          email: input.email,
          registeredAt: new Date().toISOString(),
        },
      })
    }, 1500)
  })
}
