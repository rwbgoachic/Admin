import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../buttons/Button'
import { Input } from './Input'

type TodoFormProps = {
  onTodoAdded: () => void
  userId: string
}

export function TodoForm({ onTodoAdded, userId }: TodoFormProps) {
  const [newTodo, setNewTodo] = useState('')

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!newTodo.trim()) return

    const { error } = await supabase
      .from('todos')
      .insert([{ 
        title: newTodo,
        user_id: userId 
      }])

    if (error) {
      console.error('Error adding todo:', error)
      return
    }

    setNewTodo('')
    onTodoAdded()
  }

  return (
    <form onSubmit={addTodo} className="add-todo">
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <Button type="submit" variant="primary">Add</Button>
    </form>
  )
}