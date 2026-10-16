'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckCircle2, 
  Users, 
  BarChart3, 
  Settings, 
  Plus
} from 'lucide-react';
import { NewHabitModal } from '../modals/NewHabitModal';

interface MobileNavProps {
  user: any;
}

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  return (
    <>
      {/* Barra de navegación inferior móvil estilo HabitApp */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center h-16 px-4 max-w-md mx-auto relative">
          {/* Tab: Hábitos */}
          <Link
            href="/habitos"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              pathname === '/habitos' || pathname === '/'
                ? 'text-[#572de4] dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Hábitos</span>
          </Link>

          {/* Tab: Comunidad */}
          <Link
            href="/comunidad"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              pathname?.startsWith('/comunidad')
                ? 'text-[#572de4] dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Comunidad</span>
          </Link>

          {/* Botón Central FAB (+) */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => setIsNewHabitModalOpen(true)}
              className="w-14 h-14 rounded-full bg-[#572de4] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(87,45,228,0.4)] active:scale-95 transition-transform"
              title="Crear Hábito"
              type="button"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Tab: Progreso */}
          <Link
            href="/reportes"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              pathname?.startsWith('/reportes')
                ? 'text-[#572de4] dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Progreso</span>
          </Link>

          {/* Tab: Ajustes */}
          <Link
            href="/ajustes"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              pathname?.startsWith('/ajustes')
                ? 'text-[#572de4] dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Ajustes</span>
          </Link>
        </div>
      </nav>

      <NewHabitModal
        isOpen={isNewHabitModalOpen}
        onClose={() => setIsNewHabitModalOpen(false)}
      />
    </>
  );
}
