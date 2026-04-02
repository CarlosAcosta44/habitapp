'use client'

import { useState } from 'react'
import { registerAction } from '@/actions/auth.actions'
import Link from 'next/link'
import { AuthSplitContainer } from '@/components/auth/AuthSplitContainer'

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const result = await registerAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <AuthSplitContainer 
      title="El primer capítulo<br />de tu <span class='text-indigo-400'>nueva vida</span>"
      subtitle=""
      reverseImage={true}
    >
      <div className="flex flex-col w-full max-w-sm mx-auto">
        {/* Encabezado del formulario */}
        <h2 className="text-4xl font-black text-white mb-1">
          Crear cuenta
        </h2>
        <p className="text-slate-400 italic text-sm mb-7">
          Comienza tu diario editorial hoy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          {/* Nombre y Apellidos en dos columnas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400">
                Nombre
              </label>
              <input 
                type="text" 
                name="first_name" 
                required 
                className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-sm"
                placeholder="Ej. Elena"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400">
                Apellidos
              </label>
              <input 
                type="text" 
                name="last_name" 
                required 
                className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-sm"
                placeholder="Ej. García"
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-slate-400">
              Correo electrónico
            </label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-sm"
              placeholder="nombre@ejemplo.com"
            />
          </div>

          {/* Contraseña con toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-slate-400">
              Contraseña
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password" 
                required 
                className="w-full px-4 py-3 pr-12 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-600 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-slate-400">
              Fecha de nacimiento
            </label>
            <input 
              type="date" 
              name="birthdate"
              className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm [color-scheme:dark]"
            />
          </div>

          {/* Botón */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 pt-4 bg-[#818cf8] hover:bg-[#6366f1] text-[#0b0f19] rounded-[1.125rem] font-bold text-[15px] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Registrando...' : 'Continuar'}
          </button>
        </form>

        <p className="text-center text-[14px] text-slate-400 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthSplitContainer>
  )
}