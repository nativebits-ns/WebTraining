export type Role = 'Admin' | 'Editor' | 'Viewer'

export const ROLES: Role[] = ['Admin', 'Editor', 'Viewer']

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export type CreateUserInput = Omit<User, 'id'>
