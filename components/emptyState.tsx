interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}
export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <p className="text-2xl font-semibold text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
    </div>
  )
}
