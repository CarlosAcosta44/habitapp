'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Users, 
  Settings, 
  LifeBuoy, 
  Trophy,
  BarChart3,
  Sparkles,
  Menu,
  X,
  Moon,
  Power,
  Sun,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { NewHabitModal } from '../modals/NewHabitModal';
import { logoutAction } from '@/actions/auth.actions';

interface MobileNavProps {
  user: any;
}

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  // Sync Dark Mode state
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
    window.dispatchEvent(new Event('theme-change'));
  };

  const mainTabs = [
    { name: 'Hábitos', href: '/habitos', icon: CheckSquare },
    { name: 'Retos', href: '/retos', icon: Trophy },
    { name: 'Comunidad', href: '/comunidad', icon: Users },
    { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  ];

  const handleOpenNewHabit = () => {
    setIsMenuOpen(false);
    setIsNewHabitModalOpen(true);
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (pathname?.startsWith(tab.href) && tab.href !== '/');

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 dark:text-slate-400 focus:outline-none transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute -top-px left-1/4 right-1/4 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'active:scale-95'}`} />
                <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}

          {/* Menu / Profile Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 dark:text-slate-400 focus:outline-none"
            aria-label="Abrir menú"
          >
            <div className="relative">
              {user?.fotoperfil || user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.fotoperfil || user.avatar_url}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <Menu className="w-5 h-5 active:scale-95 transition-transform" />
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium text-slate-500 dark:text-slate-400">
              Menú
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay & Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 md:hidden"
            >
              {/* Drawer Header & Profile */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider">
                    Menú
                  </h3>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <Link
                  href="/perfil"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-900/60"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {user?.fotoperfil || user?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.fotoperfil || user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-indigo-700 dark:text-white bg-indigo-100 dark:bg-indigo-600">
                        {user?.nombre?.[0] || user?.full_name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-indigo-950 dark:text-indigo-200 truncate uppercase tracking-wide">
                      {user?.nombre ? (user.apellido ? `${user.nombre} ${user.apellido}` : user.nombre) : (user?.full_name || 'Usuario')}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase tracking-widest">
                      {user?.nombrerol || 'USUARIO'}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
                <button 
                  onClick={handleOpenNewHabit}
                  className="w-full bg-[#9da8ff] hover:bg-indigo-300 text-slate-950 font-bold text-sm py-3 px-4 rounded-[2rem] transition-colors shadow-md active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Nuevo Hábito
                </button>

                <div className="space-y-1 pt-4">
                  <Link 
                    href="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    <UserIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">Mi Perfil</span>
                  </Link>

                  <Link 
                    href="/ajustes"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">Ajustes</span>
                  </Link>

                  {(user?.role === 'admin' || user?.rol === 'ADMIN' || user?.nombrerol === 'ADMIN') && (
                    <Link 
                      href="/admin/usuarios"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium transition-colors border-t border-slate-200/50 dark:border-slate-800/50 mt-1 pt-3"
                    >
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Opciones de Administrador</span>
                    </Link>
                  )}

                  {(user?.role === 'trainer' || user?.rol === 'TRAINER' || user?.nombrerol === 'TRAINER' || user?.nombrerol === 'ENTRENADOR') && (
                    <Link 
                      href="/entrenador"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium transition-colors border-t border-slate-200/50 dark:border-slate-800/50 mt-1 pt-3"
                    >
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Dashboard del Entrenador</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    {isDarkMode ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-400" />}
                    <span className="text-sm font-medium">Modo nocturno</span>
                  </div>
                  
                  <button 
                    onClick={toggleDarkMode}
                    className={`p-0.5 relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}
                  >
                    <span className="sr-only">Alternar modo nocturno</span>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Help Center */}
                <Link
                  href="/ajustes/soporte"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium transition-colors group w-full text-left"
                >
                  <LifeBuoy className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  <span className="text-sm">Centro de ayuda</span>
                </Link>
                
                {/* Logout Form */}
                <form action={logoutAction} className="w-full">
                  <button className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors text-slate-700 dark:text-slate-300 font-medium group w-full text-left">
                    <Power className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm">Cerrar sesión</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NewHabitModal 
        isOpen={isNewHabitModalOpen} 
        onClose={() => setIsNewHabitModalOpen(false)} 
      />
    </>
  );
}
