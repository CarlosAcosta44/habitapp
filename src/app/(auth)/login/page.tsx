'use client'

import { useState } from 'react'
import { loginAction } from '@/actions/auth.actions'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          HabitApp
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Bienvenido de nuevo, el progreso te espera.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Correo Electrónico
          </label>
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Contraseña
          </label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-2">
        <p>¿Olvidaste tu contraseña? <a href="#" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Recuperar</a></p>
        <p>¿No tienes cuenta? <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Regístrate</Link></p>
      </div>
    </div>
  )
}
