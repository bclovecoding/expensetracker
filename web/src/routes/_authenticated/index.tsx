import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useTotalSpent } from '@/lib/useHooks'

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, error, data } = useTotalSpent()

  if (error) return 'A error has occurred:' + error.message

  console.log({ data })

  return (
    <>
      <Card className="w-[400px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? '...' : data.total}</CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  )
}
