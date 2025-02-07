import { insertExpenseSchema } from '../server/db/schema'

export const createExpenseSchema = insertExpenseSchema.omit({
  userId: true,
  createdAt: true,
})
