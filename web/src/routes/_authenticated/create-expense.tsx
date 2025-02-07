import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

import FormError from '@/components/form-error'
import { useForm } from '@tanstack/react-form'

import { api } from '@/lib/api'
import { createExpenseSchema } from '../../../../lib/schema'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const naviage = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
      txnDate: format(new Date(), 'yyyy-MM-dd'),
    },
    validators: {
      onChange: createExpenseSchema,
      onChangeAsyncDebounceMs: 500,
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({
        json: { ...value, amount: Number(value.amount) * 100 },
      })
      if (!res.ok) throw new Error('Server error')
      naviage({ to: '/expenses' })
    },
  })
  return (
    <div className="p-2 max-w-3xl mx-auto">
      <h2 className="font-bold text-lg">Create Expense</h2>
      <form
        className="max-w-xl m-auto flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
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
                  <FormError>{field.state.meta.errors.join(', ')}</FormError>
                ) : null}
              </div>
            )
          }}
        />
        <form.Field
          name="amount"
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
                {field.state.meta.errors ? (
                  <FormError>{field.state.meta.errors.join(', ')}</FormError>
                ) : null}
              </div>
            )
          }}
        />
        <form.Field
          name="txnDate"
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div className="self-center">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange(format(date ?? new Date(), 'yyyy-MM-dd'))
                  }
                  className="rounded-md border"
                />
                {field.state.meta.errors ? (
                  <FormError>{field.state.meta.errors.join(', ')}</FormError>
                ) : null}
              </div>
            )
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4 w-full" type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Submitting...' : 'Create Expense'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
