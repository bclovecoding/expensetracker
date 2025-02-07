import { createFileRoute } from '@tanstack/react-router'
// import { useCurUser } from '@/lib/useHooks'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useQuery } from '@tanstack/react-query'
import { userQueryOptions } from '@/lib/api'

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
      <AvatarFallback>PH</AvatarFallback>
    </Avatar>
  )
}

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Not logged In</div>

  const user = data.user
  return (
    <Card className="w-[450px] m-auto">
      <CardHeader>
        <CardTitle>{`${user.given_name} ${user.family_name}`}</CardTitle>
        <CardDescription>Your profile here</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>Email: {user.email}</div>
        <div>User Id: {user.id}</div>

        <Avatar>
          <AvatarImage src={user.picture || undefined} alt="avatar" />
          <AvatarFallback>PH</AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter className="flex place-content-end">
        <Button variant="ghost" asChild>
          <a href="/api/logout">Logout</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
