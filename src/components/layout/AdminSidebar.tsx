'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  ArrowLeft,
  Moon,
  LifeBuoy,
  Power
} from 'lucide-react';
import { logoutAction } from '@/actions/auth.actions';
import { User } from '@/types/domain/user.types';

interface AdminSidebarProps {
  user: User;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved) return saved === 'dark';
    return typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;
  });

  useEffect(() => {
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
    window.dispatchEvent(new Event('theme-change'));
  };

  const adminLinks = [
    { name: 'Panel Principal', href: '/admin', icon: Shield },
    { name: 'Gestión Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Moderación Foro', href: '/admin/moderacion', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 h-full bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-300 transition-colors border-r border-slate-200 dark:border-slate-800">
      {/* Brand & User Profile Area */}
      <div className="p-6 flex flex-col space-y-6 mb-5">
        <h2 className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
          Habit<span className="text-slate-800 dark:text-white">Admin</span>
        </h2>
        
        <div className="flex items-center space-x-4 rounded-xl p-1 -m-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950 border border-indigo-200/50 dark:border-indigo-800/50">
              {user?.fotoperfil || user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.fotoperfil || user.avatar_url} alt="Admin Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-600">
                  {user?.nombre?.[0] || user?.full_name?.[0] || 'A'}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200 truncate uppercase tracking-wider leading-tight pb-1">
              {user?.nombre && user?.apellido ? `${user.nombre} ${user.apellido}` : (user?.full_name || 'ADMINISTRADOR')}
            </p>
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold truncate uppercase tracking-widest flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> {user?.nombrerol || 'ADMIN'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border-l-4 border-rose-500 rounded-l-none pl-2.5' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:group-hover:text-white group-hover:text-slate-900 transition-colors'}`} />
              <span className="text-sm">
                {link.name}
              </span>
            </Link>
          );
        })}

        {/* Separator / Go Back link */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-6 pt-4">
          <Link 
            href="/habitos"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400 dark:group-hover:text-white group-hover:text-slate-900 transition-colors" />
            <span className="text-sm font-medium">Volver a HabitApp</span>
          </Link>
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
            className={`p-0.5 relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <span className="sr-only">Toggle Dark Mode</span>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-1'}`} />
          </button>
        </div>

        <Link href="/ajustes/soporte" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-slate-600 dark:text-slate-400 group w-full text-left">
          <LifeBuoy className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-slate-400" />
          <span className="text-sm font-medium">Centro de ayuda</span>
        </Link>
        
        <form action={logoutAction} className="w-full">
          <button className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-rose-500/15 hover:text-rose-600 transition-colors text-slate-600 dark:text-slate-400 group w-full text-left">
            <Power className="w-5 h-5 group-hover:text-rose-600 transition-colors text-slate-400" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
