export type Todo = {
  id: string
  user_id: string
  text: string
  completed: boolean
  due_date: string | null
  category: string
  priority: 'high' | 'medium' | 'low'
  created_at: string
  completed_at: string | null
}
