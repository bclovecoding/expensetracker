import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'

import { api } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const naviage = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: '',
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 2000))
      const res = await api.expenses.$post({
        json: { ...value, amount: Number(value.amount) * 100 },
      })
      if (!res.ok) throw new Error('Server error')
      naviage({ to: '/expenses' })
    },
  })
  return (
    <div className="p-2">
      <h2>Create Expense</h2>
      <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Title is required'
                : value.length < 2
                  ? 'Title must be at least 3 characters'
                  : undefined,
            onChangeAsyncDebounceMs: 500,
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  placeholder="Title"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </>
            )
          }}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Amount is required'
                : Number(value) <= 0
                  ? 'Amount must be postive'
                  : undefined,
            onChangeAsyncDebounceMs: 500,
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </>
            )
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Submitting...' : 'Create Expense'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
