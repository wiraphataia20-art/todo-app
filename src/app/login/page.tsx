'use client'

import { useActionState, useState } from 'react'
import { authAction } from '@/app/actions'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [state, formAction, pending] = useActionState(authAction, null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Todo App</h1>
        <p className="text-center text-white/50 text-sm mb-8">
          {isSignUp ? 'Create a new account' : 'Sign in to your account'}
        </p>

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="type" value={isSignUp ? 'signup' : 'login'} />

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
              </svg>
            </span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1H6.663A3.5 3.5 0 0 1 3.5 11.5zm0-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </span>
            <input
              name="password"
              type="password"
              placeholder="Password (min. 6 characters)"
              required
              minLength={6}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
            />
          </div>

          {state?.error && <p className="text-red-400 text-sm pt-1">{state.error}</p>}
          {state?.message && <p className="text-green-400 text-sm pt-1">{state.message}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 mt-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl font-medium transition-all disabled:opacity-40"
          >
            {pending ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </main>
  )
}
