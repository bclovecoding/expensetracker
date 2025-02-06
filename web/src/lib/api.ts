import { hc } from 'hono/client'

import { type ApiRoutes } from '../../../server/app'
import { queryOptions } from '@tanstack/react-query'
// import { type ApiRoutes } from '@server/app'

const client = hc<ApiRoutes>('/')

export const api = client.api

export const userQueryOptions = queryOptions({
  queryKey: ['cur_user'],
  queryFn: async () => {
    const res = await api.me.$get()
    if (!res.ok) {
      throw new Error('Server Error')
    }
    const data = await res.json()
    return data
  },
  staleTime: Infinity,
})
