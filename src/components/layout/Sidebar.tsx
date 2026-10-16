'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckCircle2, 
  Users, 
  Settings, 
  HelpCircle, 
  Moon,
  Sun,
  Trophy,
  BarChart3,
  LogOut,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  Plus
} from 'lucide-react';
import { NewHabitModal } from '../modals/NewHabitModal';
import { logoutAction } from '@/actions/auth.actions';
import { User } from '@/domain/user.types';
import { NotificationBell } from '../notifications/NotificationBell';

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Dark mode sync
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    // Collapsed state from storage
    const savedCollapsed = localStorage.getItem('sidebar_collapsed');
    if (savedCollapsed === 'true') {
      setIsCollapsed(true);
    }

    window.addEventListener('theme-change', checkDark);
    return () => window.removeEventListener('theme-change', checkDark);
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

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
  };

  const navLinks = [
    { name: 'Hábitos', href: '/habitos', icon: CheckCircle2 },
    { name: 'Retos y Desafíos', href: '/retos', icon: Trophy },
    { name: 'Comunidad', href: '/comunidad', icon: Users },
    { name: 'Progreso y Métricas', href: '/reportes', icon: BarChart3 },
    { name: 'Ajustes', href: '/ajustes', icon: Settings },
  ];

  if (
    user?.role === 'admin' ||
    user?.role?.toUpperCase() === 'ADMIN' ||
    user?.nombrerol?.toUpperCase() === 'ADMIN' ||
    user?.nombrerol?.toUpperCase() === 'ADMINISTRADOR'
  ) {
    navLinks.push({ name: 'Administrador', href: '/admin', icon: Shield });
  }

  if (
    user?.role === 'trainer' ||
    user?.role?.toUpperCase() === 'TRAINER' ||
    user?.nombrerol?.toUpperCase() === 'TRAINER' ||
    user?.nombrerol?.toUpperCase() === 'ENTRENADOR'
  ) {
    navLinks.push({ name: 'Entrenador', href: '/entrenador', icon: Shield });
  }

  const avatarUrl = user?.fotoperfil || user?.avatar_url;
  const initial = user?.nombre?.[0] || user?.full_name?.[0] || 'U';
  const displayName = user?.nombre
    ? user.apellido
      ? `${user.nombre} ${user.apellido}`
      : user.nombre
    : user?.full_name || 'Usuario';

  return (
    <>
      <aside
        className={`
          h-[calc(100vh-2rem)] sticky top-4
          bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl
          rounded-3xl border border-slate-200/80 dark:border-slate-800
          shadow-[0_8px_24px_rgba(112,78,253,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
          flex flex-col justify-between p-4 shrink-0 z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col gap-5">
          {/* Header Logo + Notificaciones + Minimizar */}
          <div className="flex items-center justify-between pb-1">
            <Link
              href="/habitos"
              className={`flex items-center gap-3 overflow-hidden transition-all ${
                isCollapsed ? 'justify-center w-full' : ''
              }`}
              title="HabitApp"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="HabitApp Logo"
                className="h-9 w-9 object-contain flex-shrink-0"
                src="/images/logo-habitapp.png"
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-[17px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                    HabitApp
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    Salud Mental &amp; Hábitos
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <div className="flex items-center gap-1">
                <NotificationBell />
                <button
                  onClick={toggleCollapsed}
                  className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Minimizar barra lateral"
                  type="button"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Si está colapsado, botón para expandir y campana */}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-2 pt-1">
              <NotificationBell />
              <button
                onClick={toggleCollapsed}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Expandir barra lateral"
                type="button"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Botón Acción Crear Hábito */}
          <button
            onClick={() => setIsNewHabitModalOpen(true)}
            className={`
              w-full bg-[#572de4] hover:bg-[#4823c9] text-white
              font-semibold text-sm rounded-2xl transition-all duration-200
              shadow-[0_4px_14px_rgba(87,45,228,0.3)] hover:shadow-[0_6px_20px_rgba(87,45,228,0.4)]
              active:scale-95 flex items-center justify-center gap-2
              ${isCollapsed ? 'p-3' : 'py-3 px-4'}
            `}
            title="Crear Hábito"
            type="button"
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Nuevo Hábito</span>}
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (pathname?.startsWith(link.href) && link.href !== '/');

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  title={isCollapsed ? link.name : undefined}
                  className={`
                    flex items-center gap-3 rounded-2xl transition-all duration-200 text-[14px] font-medium
                    ${isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'}
                    ${
                      isActive
                        ? 'bg-[#572de4] text-white font-semibold shadow-[0_4px_12px_rgba(87,45,228,0.25)]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Dark Mode Switch + User Profile */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          {/* Switch Modo Oscuro / Claro */}
          <div
            className={`
              flex items-center justify-between rounded-2xl p-2 bg-slate-50 dark:bg-slate-800/50
              ${isCollapsed ? 'justify-center' : 'px-3 py-2'}
            `}
          >
            {!isCollapsed && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold">
                  {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className={`
                relative inline-flex items-center rounded-full transition-colors focus:outline-none
                ${isCollapsed ? 'p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700' : 'h-6 w-11 p-0.5'}
                ${!isCollapsed && (isDarkMode ? 'bg-[#572de4]' : 'bg-slate-300')}
              `}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              type="button"
            >
              {isCollapsed ? (
                isDarkMode ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )
              ) : (
                <>
                  <span className="sr-only">Toggle Dark Mode</span>
                  <span
                    className={`
                      inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform
                      ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </>
              )}
            </button>
          </div>

          {/* User Profile Card */}
          <div
            className={`
              rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-2.5 flex items-center justify-between
              border border-slate-200/60 dark:border-slate-800
              ${isCollapsed ? 'justify-center p-2' : ''}
            `}
          >
            <Link
              href="/perfil"
              className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}
              title="Ver perfil"
            >
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#e6deff] dark:bg-indigo-950 flex items-center justify-center text-[#1b065c] dark:text-indigo-200 font-bold text-sm">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {user?.nombrerol || 'Usuario'}
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500">
                <Link
                  href="/ajustes/soporte"
                  className="p-1.5 rounded-lg hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                  title="Ayuda y Soporte"
                >
                  <HelpCircle className="w-4 h-4" />
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      <NewHabitModal
        isOpen={isNewHabitModalOpen}
        onClose={() => setIsNewHabitModalOpen(false)}
      />
    </>
  );
}
