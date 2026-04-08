'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Users, 
  Settings, 
  LifeBuoy, 
  LogOut, 
  Moon,
  Trophy,
  BarChart3,
  Sparkles,
  HeartPulse,
  Power
} from 'lucide-react';
import { NewHabitModal } from '../modals/NewHabitModal';
import { logoutAction } from '@/actions/auth.actions';

interface SidebarProps {
  user: any; // Ideally we use the domain type
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }

    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('theme-change')); // Notificar a los demás
  };

  const navLinks = [
    { name: 'Hábitos', href: '/habitos', icon: CheckSquare },
    { name: 'Retos', href: '/retos', icon: Trophy },
    { name: 'Comunidad', href: '/comunidad', icon: Users },
    { name: 'Reportes', href: '/reportes', icon: BarChart3 },
    { name: 'Ajustes', href: '/ajustes', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-300 transition-colors border-r border-slate-200 dark:border-slate-800">
      {/* Brand & User Profile Area */}
      <div className="p-6 flex flex-col space-y-6 mb-5 ">
        <h2 className="text-2xl font-bold tracking-wide text-indigo-300">
          HabitApp
        </h2>
        
        <Link
          href="/perfil"
          className="flex items-center space-x-4 rounded-xl p-1 -m-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900/60 mb-6 "
          aria-label="Ir al perfil"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-indigo-700 dark:text-white bg-indigo-100 dark:bg-indigo-600">
                  {user?.full_name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-indigo-500 dark:bg-indigo-300 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200 truncate uppercase tracking-wider leading-tight pb-1">
              {user?.full_name || 'JOHN DOE'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase tracking-widest">
              {user?.role === 'trainer' ? 'TRAINER' : 'PREMIUM LIFESTYLE'}
            </p>
          </div>
        </Link>

        <button 
          onClick={() => setIsNewHabitModalOpen(true)}
          className="w-full bg-[#9da8ff] hover:bg-indigo-300 text-slate-950 font-bold text-sm py-3 px-4 rounded-[2rem] transition-colors shadow-lg active:scale-95 uppercase tracking-wide inline-flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Nuevo Hábito
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/');
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-indigo-100 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:group-hover:text-white group-hover:text-slate-900 transition-colors'}`} />
              <span className={`text-sm font-medium ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                {link.name}
              </span>
            </Link>
          );
        })}

        <div className="mt-8 rounded-2xl border border-indigo-200/20 bg-indigo-500/5 px-4 py-5 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
            <HeartPulse className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-indigo-300/80">
            Bienestar diario
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Cada pequeño avance suma.
          </p>
        </div>
      </nav>

      {/* Bottom Footer Area */}
      <div className="px-4 pb-6 mt-auto flex flex-col space-y-1 border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="flex items-center justify-between px-3 py-2.5 mt-2">
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <Moon className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium">Modo nocturno</span>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <span className="sr-only">Toggle Dark Mode</span>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-1'}`} />
          </button>
        </div>

        <button className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-slate-600 dark:text-slate-400 group w-full text-left">
          <LifeBuoy className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-slate-400" />
          <span className="text-sm font-medium">Centro de ayuda</span>
        </button>
        
        <form action={logoutAction} className="w-full">
          <button className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-slate-600 dark:text-slate-400 group w-full text-left">
            <Power className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-slate-400" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </form>
      </div>

      <NewHabitModal 
        isOpen={isNewHabitModalOpen} 
        onClose={() => setIsNewHabitModalOpen(false)} 
      />
    </aside>
  );
}
