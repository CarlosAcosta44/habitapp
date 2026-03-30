import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Fondo estético */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[130px]" />
      </div>

      <main className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
          {children}
        </div>
      </main>
    </div>
  )
}
