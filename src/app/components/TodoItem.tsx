'use client'

import { useTransition } from 'react'
import { toggleTodoAction, deleteTodoAction } from '@/app/actions'
import type { Todo } from '@/lib/store'

const PRIORITY_COLOR = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

const PRIORITY_DOT = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isOverdue = date < today
  const formatted = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  return { formatted, isOverdue }
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
        todo.completed
          ? 'bg-white/5 border-white/10'
          : 'bg-white/10 border-white/20 hover:bg-white/15'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <button
        onClick={() => startTransition(() => toggleTodoAction(todo.id))}
        disabled={isPending}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          todo.completed ? 'bg-green-500 border-green-500' : 'border-white/40 hover:border-white/70'
        }`}
      >
        {todo.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span className={`text-sm block ${todo.completed ? 'line-through text-white/30' : 'text-white'}`}>
          {todo.text}
        </span>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {todo.category && todo.category !== 'General' && todo.category !== 'ทั่วไป' && (
            <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
              {todo.category}
            </span>
          )}
          {todo.priority && todo.priority !== 'medium' && (
            <span className={`text-xs ${PRIORITY_COLOR[todo.priority]}`}>
              {PRIORITY_DOT[todo.priority]}
            </span>
          )}
          {todo.due_date && (() => {
            const { formatted, isOverdue } = formatDate(todo.due_date)
            return (
              <span className={`text-xs ${isOverdue && !todo.completed ? 'text-red-400 font-medium' : 'text-white/30'}`}>
                📅 {formatted}{isOverdue && !todo.completed ? ' Overdue!' : ''}
              </span>
            )
          })()}
        </div>
      </div>

      <button
        onClick={() => startTransition(() => deleteTodoAction(todo.id))}
        disabled={isPending}
        className="text-white/20 hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
