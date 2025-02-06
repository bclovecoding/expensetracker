import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useTotalSpent = () => {
  const query = useQuery({
    queryKey: ['get-total-spent'],
    queryFn: async () => {
      const res = await api.expenses['total-spent'].$get()
      if (!res.ok) {
        throw new Error('Server Error')
      }
      const data = await res.json()
      return data
    },
  })
  return query
}

const useExpenses = () => {
  const query = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: async () => {
      const res = await api.expenses.$get()
      if (!res.ok) {
        throw new Error('Server Error')
      }
      const data = await res.json()
      return data
    },
  })
  return query
}

// const useCreateExpense = ()=>{
//   const mut = useMutation({

//   })

//   return mut
// }

export { useTotalSpent, useExpenses }
