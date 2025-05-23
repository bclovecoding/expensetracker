import * as React from 'react'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'

interface MyRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: Root,
})

function Root() {
  return (
    <React.Fragment>
      <NavBar />
      <hr />
      <Outlet />
    </React.Fragment>
  )
}

function NavBar() {
  return (
    <div className="p-2 flex justify-between  max-w-3xl m-auto">
      <Link to="/">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
      </Link>
      <div className="flex gap-4">
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
    </div>
  )
}
