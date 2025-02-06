import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
// src/routes/_authenticated.tsx

const Login = () => {
  return (
    <div>
      <a href="/api/login">Login</a>
    </div>
  )
}

const User = () => {
  const { user } = Route.useRouteContext()
  if (!user) return <Login />
  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    try {
      const { queryClient } = context
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch {
      return { user: null }
    }
  },
  component: User,
})
