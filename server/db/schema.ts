import { pgTable, serial, text, index, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export const expenseTable = pgTable(
  'expense',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: integer('amount').notNull(),
  },
  (expense) => [index('user_id_idx').on(expense.userId)]
)

export const createExpenseSchema = createInsertSchema(expenseTable)
