'use client'

import { useActionState, useRef, useState } from 'react'
import { registerAction, type RegisterActionState } from '@/actions/auth.actions'
import Link from 'next/link'
import { AuthSplitContainer } from '@/components/auth/AuthSplitContainer'
import {
  ONBOARDING_HABIT_PRESETS,
  type OnboardingHabitPresetId,
} from '@/lib/onboarding-habits'

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )

const initialRegisterState: RegisterActionState = {}

export default function RegisterPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [genero, setGenero] = useState<'Masculino' | 'Femenino' | null>(null)
  const [habitsSelected, setHabitsSelected] = useState<Set<OnboardingHabitPresetId>>(
    () => new Set()
  )

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialRegisterState
  )

  function toggleHabit(id: OnboardingHabitPresetId) {
    setHabitsSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function goToStep2() {
    const el = formRef.current
    if (!el) return
    const ok = ['nombre', 'apellido', 'email', 'password'].every((name) => {
      const input = el.elements.namedItem(name) as HTMLInputElement | null
      return input?.reportValidity() ?? false
    })
    if (ok) setStep(2)
  }

  const habitPresetsJson = JSON.stringify([...habitsSelected])

  return (
    <AuthSplitContainer
      title={
        step === 1
          ? "El primer capítulo<br />de tu <span class='text-indigo-400'>nueva vida</span>"
          : "Tus hábitos definen tu <span class='text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400'>futuro</span>."
      }
      subtitle={step === 1 ? '' : 'Únete a una comunidad que crece cada día.'}
      reverseImage={step === 1}
      formMaxWidth={step === 2 ? 'lg' : 'sm'}
    >
      <form ref={formRef} action={formAction} className="flex flex-col w-full mx-auto">
        {/* —— Paso 1: datos básicos (siempre en el DOM; oculto en paso 2) —— */}
        <fieldset
          className={step === 1 ? 'contents' : 'hidden'}
          aria-hidden={step !== 1}
        >
          <h2 className="text-4xl font-black text-white mb-1">Crear cuenta</h2>
          <p className="text-slate-400 italic text-sm mb-7">
            Comienza tu diario editorial hoy.
          </p>

          {state?.error && step === 1 && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 mb-4">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-slate-400" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  required
                  className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-sm"
                  placeholder="Ej. Elena"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-slate-400" htmlFor="apellido">
                  Apellidos
                </label>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  required
                  className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-sm"
                  placeholder="Ej. García"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-sm"
                placeholder="nombre@ejemplo.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-[1.125rem] bg-[#1e2536] border-none text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium tracking-widest placeholder:tracking-normal placeholder:text-slate-600 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400" htmlFor="birthdate">
                Fecha de nacimiento
              </label>
              <input
                id="birthdate"
                type="date"
                name="birthdate"
                className="w-full px-4 py-3 rounded-[1.125rem] bg-[#1e2536] border-none text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm [color-scheme:dark]"
              />
            </div>

            <button
              type="button"
              onClick={goToStep2}
              className="w-full py-3.5 pt-4 bg-[#818cf8] hover:bg-[#6366f1] text-[#0b0f19] rounded-[1.125rem] font-bold text-[15px] transition-all transform hover:scale-[1.02] mt-2"
            >
              Continuar
            </button>
          </div>
        </fieldset>

        {/* —— Paso 2 —— */}
        <div className={step === 2 ? 'contents' : 'hidden'}>
          <h2 className="text-3xl font-black text-white mb-1">
            Personaliza tu experiencia
          </h2>
          <p className="text-slate-400 text-sm mb-6">Dinos un poco más sobre ti</p>

          {state?.error && step === 2 && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 mb-4">
              {state.error}
            </div>
          )}

          <input type="hidden" name="habit_presets_json" value={habitPresetsJson} readOnly />
          <input type="hidden" name="genero" value={genero ?? ''} readOnly />

          <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase mb-3">
            Elige tu género
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setGenero('Masculino')}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                genero === 'Masculino'
                  ? 'border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'border-slate-600/80 bg-[#1e2536] hover:border-slate-500'
              }`}
            >
              <span className="text-2xl">👨</span>
              <p className="text-white font-semibold mt-2">Hombre</p>
            </button>
            <button
              type="button"
              onClick={() => setGenero('Femenino')}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                genero === 'Femenino'
                  ? 'border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'border-slate-600/80 bg-[#1e2536] hover:border-slate-500'
              }`}
            >
              <span className="text-2xl">👩</span>
              <p className="text-white font-semibold mt-2">Mujer</p>
            </button>
          </div>

          <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase mb-3">
            Elige tus hábitos
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {ONBOARDING_HABIT_PRESETS.map((h) => {
              const active = habitsSelected.has(h.id)
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggleHabit(h.id)}
                  className={`rounded-2xl border-2 p-3 text-left transition-all ${
                    active
                      ? 'border-sky-400 bg-sky-500/10 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                      : 'border-slate-600/80 bg-[#1e2536] hover:border-slate-500'
                  }`}
                >
                  <span className="text-xl">{h.emoji}</span>
                  <p className="text-white text-sm font-medium mt-1 leading-tight">{h.label}</p>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-indigo-400 text-[#0b0f19] rounded-[1.125rem] font-bold text-[15px] transition-all hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creando cuenta…' : 'Finalizar registro'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-slate-400 hover:text-slate-300 text-left"
            >
              ← Volver
            </button>
          </div>
        </div>

        {step === 1 && (
          <p className="text-center text-[14px] text-slate-400 mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Inicia sesión
            </Link>
          </p>
        )}
      </form>
    </AuthSplitContainer>
  )
}
