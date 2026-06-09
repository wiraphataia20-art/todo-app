'use client'

import { useRef, useState, useTransition } from 'react'
import { addTodoAction } from '@/app/actions'

const CATEGORIES = ['General', 'Work', 'Study', 'Personal', 'Shopping']

export default function TodoForm() {
  const ref = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [showOptions, setShowOptions] = useState(false)

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
          await addTodoAction(formData)
          ref.current?.reset()
          setShowOptions(false)
        })
      }}
      className="space-y-3"
    >
      <div className="flex gap-2">
        <input
          name="text"
          type="text"
          placeholder="Add a new todo..."
          required
          className="flex-1 min-w-0 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-base"
        />
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="px-3 py-3 bg-white/10 border border-white/20 text-white/50 hover:bg-white/20 rounded-xl transition-all text-base flex-shrink-0"
          title="More options"
        >
          ⚙️
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/25 text-white rounded-xl disabled:opacity-40 transition-all font-medium flex-shrink-0"
        >
          {isPending ? '...' : 'Add'}
        </button>
      </div>

      {showOptions && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">Due date</label>
            <input
              name="due_date"
              type="date"
              className="px-3 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">Category</label>
            <select
              name="category"
              defaultValue="General"
              className="px-3 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-800">{c}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">Priority</label>
            <select
              name="priority"
              defaultValue="medium"
              className="px-3 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
            >
              <option value="high" className="bg-gray-800">High 🔴</option>
              <option value="medium" className="bg-gray-800">Medium 🟡</option>
              <option value="low" className="bg-gray-800">Low 🟢</option>
            </select>
          </div>
        </div>
      )}
    </form>
  )
}
