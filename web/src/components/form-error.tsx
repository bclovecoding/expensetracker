const FormError = ({ children }: React.PropsWithChildren) => {
  return (
    <em role="alert" className="text-rose-600 text-xs">
      {children}
    </em>
  )
}
export default FormError
