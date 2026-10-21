import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, fetchUsers } from '../api/usersApi'
import type { User } from '../types'

export const USERS_KEY = ['users'] as const

export function useUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: fetchUsers })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: USERS_KEY })

      const previousUsers = queryClient.getQueryData<User[]>(USERS_KEY)

      queryClient.setQueryData<User[]>(USERS_KEY, (old) => old?.filter((u) => u.id !== id))

      return { previousUsers }
    },

    onError: (_error, _id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(USERS_KEY, context.previousUsers)
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}
