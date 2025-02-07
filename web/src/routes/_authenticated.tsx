import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { userQueryOptions } from '@/lib/api'
// src/routes/_authenticated.tsx

const Login = () => {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-y-2 items-center p-2">
      <h1 className="text-lg font-bold">You need to login or register</h1>
      <Button asChild variant="ghost">
        <a href="/api/login">Login</a>
      </Button>
      <Button asChild variant="ghost">
        <a href="/api/register">Register</a>
      </Button>
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
