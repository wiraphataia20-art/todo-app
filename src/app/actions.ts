'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function authAction(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const type = formData.get('type') as string

  if (type === 'signup') {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    return { message: 'Check your email to confirm your account.' }
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: 'Invalid email or password.' }
    redirect('/')
  }
}

export async function addTodoAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const text = formData.get('text') as string
  const due_date = formData.get('due_date') as string || null
  const category = formData.get('category') as string || 'General'
  const priority = formData.get('priority') as string || 'medium'

  if (!text?.trim()) return

  await supabase.from('todos').insert({
    user_id: user.id,
    text: text.trim(),
    due_date: due_date || null,
    category,
    priority,
  })

  if (due_date && user.email) {
    const dueDate = new Date(due_date)
    dueDate.setHours(23, 59, 0, 0)

    const reminderDate = new Date(due_date)
    reminderDate.setDate(reminderDate.getDate() - 1)
    reminderDate.setHours(9, 0, 0, 0)

    const now = new Date()
    const sendAt = reminderDate > now ? reminderDate : now

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: `⏰ Reminder: "${text.trim()}" is due ${reminderDate > now ? 'tomorrow' : 'today'}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a">Todo Reminder</h2>
          <p>Don't forget your todo:</p>
          <div style="background:#f4f4f5;border-radius:8px;padding:16px;margin:16px 0">
            <strong style="font-size:16px">${text.trim()}</strong>
          </div>
          <p style="color:#666">Due date: <strong>${dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
        </div>
      `,
      ...(reminderDate > now && { scheduledAt: reminderDate.toISOString() }),
    })
  }

  revalidatePath('/')
}

export async function toggleTodoAction(id: string) {
  const supabase = await createClient()
  const { data: todo } = await supabase.from('todos').select('completed').eq('id', id).single()
  if (!todo) return
  const nowCompleted = !todo.completed
  await supabase.from('todos').update({
    completed: nowCompleted,
    completed_at: nowCompleted ? new Date().toISOString() : null,
  }).eq('id', id)
  revalidatePath('/')
}

export async function deleteTodoAction(id: string) {
  const supabase = await createClient()
  await supabase.from('todos').delete().eq('id', id)
  revalidatePath('/')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
