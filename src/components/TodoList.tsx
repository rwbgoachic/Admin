import { supabase } from '../lib/supabase'
import { Button } from './buttons/Button'

type Todo = {
  id: string
  title: string
  completed: boolean
}

type TodoListProps = {
  todos: Todo[]
  onTodoUpdated: () => void
}

export function TodoList({ todos, onTodoUpdated }: TodoListProps) {
  async function toggleTodo(id: string, completed: boolean) {
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)

    if (error) {
      console.error('Error updating todo:', error)
      return
    }

    onTodoUpdated()
  }

  async function deleteTodo(id: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error)
      return
    }

    onTodoUpdated()
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => toggleTodo(todo.id, e.target.checked)}
          />
          <span>{todo.title}</span>
          <Button 
            variant="danger" 
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </Button>
        </li>
      ))}
    </ul>
  )
}