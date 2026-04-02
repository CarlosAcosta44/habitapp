'use client'

import { useState } from 'react'
import { loginAction } from '@/actions/auth.actions'
import Link from 'next/link'
import { AuthSplitContainer } from '@/components/auth/AuthSplitContainer'

// Iconos vectoriales simples
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
  </svg>
)

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
  </svg>
)

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
    <AuthSplitContainer 
      title="Bienvenido<br/>de nuevo"
      subtitle="Sigue cultivando tus hábitos.<br/>Tu historia continúa hoy."
    >
      <div className="flex flex-col w-full max-w-sm mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[13px] italic text-slate-400">
              Correo electrónico
            </label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-4 py-3.5 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-500"
              placeholder="ejemplo@habit.app"
            />
          </div>

          <div className="space-y-1.5 flex flex-col relative">
            <div className="flex justify-between items-center w-full">
              <label className="text-[13px] italic text-slate-400">
                Contraseña
              </label>
              <Link href="/forgot-password" className="text-[13px] text-slate-400 hover:text-indigo-400 transition-colors">
                ¿Olvidé mi contraseña?
              </Link>
            </div>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-4 py-3.5 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 pt-4 bg-[#818cf8] hover:bg-[#6366f1] text-[#111827] rounded-[1.125rem] font-bold text-[15px] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-[#0b0f19] px-4 text-slate-500">O INICIA SESIÓN CON</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <button type="button" className="flex items-center justify-center py-3 bg-[#1e2536] hover:bg-slate-700 transition-colors rounded-[1rem] text-slate-300">
            <GoogleIcon />
          </button>
          <button type="button" className="flex items-center justify-center py-3 bg-[#1e2536] hover:bg-slate-700 transition-colors rounded-[1rem] text-slate-300">
            <AppleIcon />
          </button>
          <button type="button" className="flex items-center justify-center py-3 bg-[#1e2536] hover:bg-slate-700 transition-colors rounded-[1rem] text-slate-300">
            <FacebookIcon />
          </button>
        </div>

        <p className="text-center text-[14px] text-slate-400 pt-2">
          ¿No tienes cuenta? <Link href="/register" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">Créala aquí</Link>
        </p>
      </div>
    </AuthSplitContainer>
  )
}
