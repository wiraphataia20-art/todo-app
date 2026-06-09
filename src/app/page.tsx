import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import { signOutAction } from './actions'
import type { Todo } from '@/lib/store'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .or(`completed.eq.false,completed_at.gt.${cutoff}`)
    .order('created_at', { ascending: false })

  const allTodos = (todos ?? []) as Todo[]
  const completed = allTodos.filter((t) => t.completed).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Todo App</h1>
          <p className="text-white/40 text-sm">{user.email}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-4 sm:p-6 space-y-5 shadow-2xl">
          <TodoForm />

          {allTodos.length > 0 && (
            <div className="flex items-center justify-between text-xs text-white/40 px-1">
              <span>{allTodos.length} tasks</span>
              <span>{completed}/{allTodos.length} completed</span>
            </div>
          )}

          <div className="space-y-2">
            {allTodos.length === 0 ? (
              <div className="text-center py-10 text-white/30">
                <p className="text-3xl mb-2">📝</p>
                <p>No todos yet. Add your first one!</p>
              </div>
            ) : (
              allTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            )}
          </div>
        </div>

        <form action={signOutAction} className="mt-4 text-center">
          <button type="submit" className="text-xs text-white/30 hover:text-white/60 underline transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
