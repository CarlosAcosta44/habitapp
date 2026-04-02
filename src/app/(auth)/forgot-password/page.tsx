'use client'

import { useState } from 'react'
import { resetPasswordAction } from '@/actions/auth.actions'
import Link from 'next/link'
import { AuthSplitContainer } from '@/components/auth/AuthSplitContainer'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    const formData = new FormData(event.currentTarget)
    const result = await resetPasswordAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(result.success)
      setLoading(false)
    }
  }

  return (
    <AuthSplitContainer 
      title="Recupera<br/>tu acceso"
      subtitle="Tu camino hacia el éxito no tiene por qué detenerse. Estamos aquí pra ayudarte a retomar tus hábitos y volver a conectar con tu comunidad"
    >
      <div className="flex flex-col w-full max-w-sm mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">
          Recuperar contraseña
        </h2>

        {success ? (
          <div className="bg-[#1e2536] border border-emerald-500/20 p-6 rounded-[1.125rem] text-center space-y-4">
             <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <p className="text-slate-300 text-sm font-medium">
               {success}
             </p>
             <Link href="/login" className="block w-full py-3 mt-4 bg-[#818cf8] hover:bg-[#6366f1] text-[#111827] rounded-[1rem] font-bold text-[14px] transition-all">
               Volver al inicio de sesión
             </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-1.5 flex flex-col">
              <label className="text-[13px] italic text-slate-400">
                Correo electrónico asociado
              </label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full px-4 py-3.5 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-500"
                placeholder="ejemplo@habit.app"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 pt-4 bg-[#818cf8] hover:bg-[#6366f1] text-[#111827] rounded-[1.125rem] font-bold text-[15px] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center text-[14px] text-slate-400 pt-8">
            ¿Recordaste tu contraseña? <Link href="/login" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">Inicia sesión</Link>
          </p>
        )}
      </div>
    </AuthSplitContainer>
  )
}
