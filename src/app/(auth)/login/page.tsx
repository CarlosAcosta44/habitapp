'use client'

import { Suspense, useState } from 'react'
import { loginAction } from '@/actions/auth.actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthSplitContainer } from '@/components/auth/AuthSplitContainer'
import { createClient } from '@/lib/supabase/client'

// Iconos vectoriales simples
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="currentColor" className="w-5 h-5">
    <path fill="#f25022" d="M0 0h11v11H0z"/>
    <path fill="#00a4ef" d="M0 12h11v11H0z"/>
    <path fill="#7fba00" d="M12 0h11v11H12z"/>
    <path fill="#ffb900" d="M12 12h11v11H12z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
  </svg>
)

function OAuthErrorAlert() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  if (!error && !message) return null

  return (
    <>
      {error && (
        <div className="p-3 mb-5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 mb-5 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
          {message}
        </div>
      )}
    </>
  )
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

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
    // Si no hay error, loginAction hizo redirect y el componente se desmontará
  }

  const handleOAuth = async (provider: 'google' | 'facebook' | 'azure') => {
    const supabase = createClient()
    setOauthLoading(provider)
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
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

        <Suspense fallback={null}>
          <OAuthErrorAlert />
        </Suspense>

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
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            className="flex items-center justify-center py-3 bg-[#1e2536] hover:bg-slate-700 transition-colors rounded-[1rem] text-slate-300 disabled:opacity-60"
          >
            <GoogleIcon />
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('azure')}
            disabled={!!oauthLoading}
            className="flex items-center justify-center py-3 bg-[#1e2536] hover:bg-slate-700 transition-colors rounded-[1rem] text-slate-300 disabled:opacity-60"
          >
            <MicrosoftIcon />
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('facebook')}
            disabled={!!oauthLoading}
            className="flex items-center justify-center py-3 bg-[#1e2536] hover:bg-slate-700 transition-colors rounded-[1rem] text-slate-300 disabled:opacity-60"
          >
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
