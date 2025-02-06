import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import { expensesRoute } from './routes/expenses'
import { authRoute } from './routes/auth'

const app = new Hono()

app.use(logger())

const apiRoutes = app
  .basePath('/api')
  .route('/', authRoute)
  .route('/expenses', expensesRoute)

app.get('*', serveStatic({ root: './web/dist' }))
app.get('*', serveStatic({ path: './web/dist/index.html' }))

export default app
export type ApiRoutes = typeof apiRoutes
