import React from 'react'

interface AuthSplitContainerProps {
  children: React.ReactNode
  title: string
  subtitle: string
  reverseImage?: boolean
}

export function AuthSplitContainer({ children, title, subtitle, reverseImage = false }: AuthSplitContainerProps) {
  return (
    <div className={`w-full min-h-screen flex flex-col ${reverseImage ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}>
      
      {/* Panel de Imagen Decorativa */}
      <div className="hidden md:flex w-1/2 relative min-h-screen items-center justify-center overflow-hidden">
        
        {/* Degradado — clase completa según lado */}
        {reverseImage ? (
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/20 to-transparent" />
        ) : (
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-l from-[#0b0f19] via-[#0b0f19]/20 to-transparent" />
        )}

        <img 
          src="/images/auth-bg.png" 
          alt="Auth Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 flex flex-col items-center justify-center p-12 text-white w-full h-full text-center gap-8">
          
          <h1
            className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-xl"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {subtitle && (
            <p
              className="text-lg italic text-slate-300 drop-shadow-lg max-w-md"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-indigo-500 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0" alt="Avatar" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-emerald-500 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Anita&backgroundColor=e2e8f0" alt="Avatar" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-rose-500 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Max&backgroundColor=e2e8f0" alt="Avatar" />
              </div>
            </div>
            <p className="text-sm font-medium text-white drop-shadow-lg">
              <span className="font-bold">+ 12k usuarios</span>
              <br />
              <span className="italic opacity-80">escribiendo su historia hoy</span>
            </p>
          </div>

        </div>
      </div>

      {/* Panel del Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 min-h-screen">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  )
}