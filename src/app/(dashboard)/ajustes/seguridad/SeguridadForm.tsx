"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { 
  updateNameAction, 
  updateEmailAction, 
  updatePasswordAction, 
  ActionState 
} from "@/actions/seguridad.actions";

interface SeguridadFormProps {
  initialName: string;
  initialLastName: string;
  initialEmail: string;
}

export function SeguridadForm({ initialName, initialLastName, initialEmail }: SeguridadFormProps) {
  const [activeTab, setActiveTab] = useState<"perfil" | "email" | "password">("perfil");

  // Estados de acciones
  const [nameState, nameAction, isNamePending] = useActionState<ActionState, FormData>(
    updateNameAction,
    {}
  );
  const [emailState, emailAction, isEmailPending] = useActionState<ActionState, FormData>(
    updateEmailAction,
    {}
  );
  const [passwordState, passwordAction, isPasswordPending] = useActionState<ActionState, FormData>(
    updatePasswordAction,
    {}
  );

  return (
    <div className="max-w-3xl mx-auto pb-12 w-full">
      {/* ── Breadcrumb & Header ────────────────────────────────────────────── */}
      <div className="mb-8">
        <Link 
          href="/ajustes" 
          className="inline-flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-bold text-sm hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Volver a Ajustes
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white italic text-center md:text-left">
          Seguridad y Perfil
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center md:text-left">
          Actualiza tu información personal y credenciales de acceso.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        
        {/* ── Tabs Navigation ──────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row border-b border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex-1 py-4 px-6 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === "perfil" 
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-4 px-6 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === "email" 
                ? "border-pink-500 text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-900/10" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Correo Electrónico
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-4 px-6 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === "password" 
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Contraseña
          </button>
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────────── */}
        <div className="p-6 md:p-8">
          
          {/* TAB: DATOS PERSONALES */}
          {activeTab === "perfil" && (
            <form action={nameAction} className="space-y-6 max-w-xl mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Información Pública</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cómo te verán los demás en la comunidad de HabitApp.
                </p>
              </div>

              {nameState?.success && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl text-center">
                  {nameState.success}
                </div>
              )}
              {nameState?.error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-xl text-center">
                  {nameState.error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    defaultValue={initialName}
                    className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  {nameState?.formErrors?.nombre && <p className="text-xs text-red-500">{nameState.formErrors.nombre[0]}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="apellido" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Apellidos</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    defaultValue={initialLastName}
                    className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  {nameState?.formErrors?.apellido && <p className="text-xs text-red-500">{nameState.formErrors.apellido[0]}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <label htmlFor="password-name" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Contraseña Actual (Verificación)
                </label>
                <input
                  type="password"
                  id="password-name"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                {nameState?.formErrors?.password && <p className="text-xs text-red-500">{nameState.formErrors.password[0]}</p>}
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">Requerimos tu contraseña por seguridad antes de guardar.</p>
              </div>

              <button
                type="submit"
                disabled={isNamePending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
              >
                {isNamePending ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </form>
          )}

          {/* TAB: CORREO ELECTRÓNICO */}
          {activeTab === "email" && (
            <form action={emailAction} className="space-y-6 max-w-xl mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cambio de Acceso</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tu correo electrónico actual es <strong className="text-slate-700 dark:text-slate-300">{initialEmail}</strong>
                </p>
              </div>

              {emailState?.success && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl text-center">
                  {emailState.success}
                </div>
              )}
              {emailState?.error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-xl text-center">
                  {emailState.error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nuevo Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nuevo@correo.com"
                  className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />
                {emailState?.formErrors?.email && <p className="text-xs text-red-500">{emailState.formErrors.email[0]}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <label htmlFor="password-email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Contraseña Actual (Verificación)
                </label>
                <input
                  type="password"
                  id="password-email"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />
                {emailState?.formErrors?.password && <p className="text-xs text-red-500">{emailState.formErrors.password[0]}</p>}
              </div>

              <button
                type="submit"
                disabled={isEmailPending}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
              >
                {isEmailPending ? (
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  "Solicitar Cambio de Correo"
                )}
              </button>
            </form>
          )}

          {/* TAB: CONTRASEÑA */}
          {activeTab === "password" && (
            <form action={passwordAction} className="space-y-6 max-w-xl mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Proteger tu Cuenta</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Asegúrate de usar una contraseña larga y única.
                </p>
              </div>

              {passwordState?.success && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl text-center">
                  {passwordState.success}
                </div>
              )}
              {passwordState?.error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-xl text-center">
                  {passwordState.error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="oldPassword" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contraseña Actual</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  {passwordState?.formErrors?.oldPassword && <p className="text-xs text-red-500">{passwordState.formErrors.oldPassword[0]}</p>}
                </div>
                
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80"></div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  {passwordState?.formErrors?.newPassword && <p className="text-xs text-red-500">{passwordState.formErrors.newPassword[0]}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Repite la nueva contraseña"
                    className="w-full bg-slate-50 dark:bg-[#1a2332] text-sm text-slate-900 dark:text-white rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  {passwordState?.formErrors?.confirmPassword && <p className="text-xs text-red-500">{passwordState.formErrors.confirmPassword[0]}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPasswordPending}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center mt-6"
              >
                {isPasswordPending ? (
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  "Guardar Contraseña"
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
