import { Button } from './buttons/Button'

type TodoItemProps = {
  id: string
  title: string
  completed: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onToggle(id, e.target.checked)}
      />
      <span>{title}</span>
      <Button 
        variant="danger" 
        onClick={() => onDelete(id)}
      >
        Delete
      </Button>
    </li>
  )
}