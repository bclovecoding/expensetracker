import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { and, eq, sum, desc } from 'drizzle-orm'

import { db } from '../db/drizzle'
import { expenseTable as DataTable, insertExpenseSchema } from '../db/schema'
import { createExpenseSchema } from '../../lib/schema'
import { kindeUser } from '../kinde'

const idClause = (id: number) => {
  return eq(DataTable.id, id)
}

export const expensesRoute = new Hono()
  .get('/', kindeUser, async (c) => {
    const user = c.var.user
    const data = await db
      .select()
      .from(DataTable)
      .where(eq(DataTable.userId, user.id))
      .orderBy(desc(DataTable.txnDate))
      .limit(100)

    return c.json({
      expenses: data,
    })
    // return c.json({ expenses: fakeExpenses })
  })
  .get('/total-spent', kindeUser, async (c) => {
    const user = c.var.user
    const data = await db
      .select({ total: sum(DataTable.amount) })
      .from(DataTable)
      .where(eq(DataTable.userId, user.id))
      .limit(1)
      .then((res) => res[0])

    if (!data) return c.json({ total: 0 })

    return c.json({ total: Number(data.total) })
  })
  .post('/', kindeUser, zValidator('json', createExpenseSchema), async (c) => {
    const user = c.var.user
    const createItem = c.req.valid('json')

    // console.log({ createItem })

    const validatedExpense = insertExpenseSchema.parse({
      ...createItem,
      userId: user.id,
    })
    const result = await db
      .insert(DataTable)
      .values(validatedExpense)
      .returning()
    c.status(201)
    return c.json(result)
  })
  .get('/:id{[0-9]+}', kindeUser, async (c) => {
    const user = c.var.user
    const id = Number.parseInt(c.req.param('id'))
    const expense = await db
      .select()
      .from(DataTable)
      .where(and(idClause(id), eq(DataTable.userId, user.id)))
      .then((res) => res[0])

    if (expense) return c.json({ expense })
    return c.notFound()
  })
  .delete('/:id{[0-9]+}', kindeUser, async (c) => {
    const user = c.var.user
    const id = Number.parseInt(c.req.param('id'))
    const expense = await db
      .delete(DataTable)
      .where(and(idClause(id), eq(DataTable.userId, user.id)))
      .returning()
      .then((res) => res[0])

    if (!expense) {
      return c.notFound()
    }

    return c.json(expense)
  })
