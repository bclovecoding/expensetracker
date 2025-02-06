import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { and, eq, sum } from 'drizzle-orm'

const expenseSchema = z.object({
  id: z.number(),
  title: z.string().min(2).max(20, 'title太长了'),
  amount: z.number().int(),
})
const createExpenseSchema = expenseSchema.omit({ id: true })

import { db } from '../db/drizzle'
import { expenseTable as DataTable } from '../db/schema'
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
      .orderBy(DataTable.title)
    console.log(data)
    return c.json({
      expenses: data,
    })
    // return c.json({ expenses: fakeExpenses })
  })
  .get('/total-spent', kindeUser, async (c) => {
    const user = c.var.user
    const data = await db
      .select({ value: sum(DataTable.amount) })
      .from(DataTable)
      .where(eq(DataTable.userId, user.id))
    if (!data) return c.notFound()

    return c.json({ total: data[0].value })
  })
  .get('/:id', kindeUser, async (c) => {
    const user = c.var.user
    const id = Number(c.req.param('id'))
    const foundItem = await db
      .select()
      .from(DataTable)
      .where(and(idClause(id), eq(DataTable.userId, user.id)))
    if (foundItem) return c.json(foundItem[0])
    return c.notFound()
  })
  .post('/', kindeUser, zValidator('json', createExpenseSchema), async (c) => {
    const user = c.var.user
    const createItem = c.req.valid('json')
    const result = await db
      .insert(DataTable)
      .values({
        ...createItem,
        userId: user.id,
      })
      .returning()
    c.status(201)
    return c.json(result)
  })
  .delete('/:id', kindeUser, async (c) => {
    const user = c.var.user
    const id = Number(c.req.param('id'))
    const deletedExpense = await db
      .delete(DataTable)
      .where(and(idClause(id), eq(DataTable.userId, user.id)))
      .returning()
    if (!deletedExpense) {
      return c.notFound()
    }

    return c.json(deletedExpense[0])
  })
