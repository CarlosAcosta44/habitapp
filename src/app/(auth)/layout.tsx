import React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-[#0b0f19] text-white font-sans overflow-x-hidden overflow-y-auto">
      {/* Header Fijo/Absoluto */}
      <header className="absolute top-0 left-0 p-6 sm:p-10 z-50 flex justify-between items-center w-full pointer-events-none">
        <Link href="/" className="text-2xl font-black tracking-tight text-white hover:opacity-80 transition-opacity pointer-events-auto">
          Habit<span className="text-indigo-500">App</span>
        </Link>
        <button className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-semibold transition-colors pointer-events-auto shadow-xl">
          ?
        </button>
      </header>

      {/* Main Content a nivel raíz para estirarse al 100% */}
      <main className="w-full min-h-screen m-0 p-0">
        {children}
      </main>
      
    </div>
  )
}
