'use client'

import { useState } from 'react'
import { updatePasswordAction } from '@/actions/auth.actions'
import { AuthSplitContainer } from '@/components/auth/AuthSplitContainer'

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    if (formData.get('password') !== formData.get('confirm_password')) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    const result = await updatePasswordAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <AuthSplitContainer 
      title="Nueva etapa,<br/>nueva contraseña"
      subtitle="El cambio es la única constante. Tu evolución comienza con la seguridad de tu espacio personal."
    >
      <div className="flex flex-col w-full max-w-sm mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">
          Nueva contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[13px] italic text-slate-400">
              Nueva contraseña
            </label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-4 py-3.5 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[13px] italic text-slate-400">
              Confirmar nueva contraseña
            </label>
            <input 
              type="password" 
              name="confirm_password" 
              required 
              className="w-full px-4 py-3.5 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 pt-4 bg-[#818cf8] hover:bg-[#6366f1] text-[#111827] rounded-[1.125rem] font-bold text-[15px] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Actualizando...' : 'Restablecer contraseña'}
          </button>
        </form>
      </div>
    </AuthSplitContainer>
  )
}
