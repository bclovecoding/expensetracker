import { z } from 'zod'
import {
  pgTable,
  serial,
  text,
  index,
  integer,
  timestamp,
  date,
} from 'drizzle-orm/pg-core'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const expenseTable = pgTable(
  'expense',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: integer('amount').notNull(),
    txnDate: date('txn_date').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (expense) => [index('user_id_idx').on(expense.userId)]
)

export const insertExpenseSchema = createInsertSchema(expenseTable, {
  title: z
    .string({
      invalid_type_error: 'Invalid title',
      required_error: 'Title is required',
    })
    .min(2, '至少2位')
    .max(20, 'title太长了'),
  amount: z
    .number({
      invalid_type_error: '需要填写金额',
      required_error: '需要填写金额',
    })
    .positive('必须是正数'),
})
export const selectExpenseSchema = createSelectSchema(expenseTable)
