"use client";

import React, { useActionState, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePerfilBasicoAction, updateAvatarAction } from "@/actions/perfil.actions";
import { updatePasswordAction } from "@/actions/seguridad.actions";
import type { ProfileForEdit } from "@/domain/perfil.types";
import {
  Camera,
  Flame,
  Badge,
  Lock,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Info,
  Check,
  Loader2,
  ChevronDown,
} from "lucide-react";

interface Props {
  profile: ProfileForEdit;
  userId: string;
  email?: string;
  racha?: number;
}

export function EditProfileForm({ profile, email, racha = 24 }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updatePerfilBasicoAction, null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.fotoperfil);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Estados de visibilidad de contraseña
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Valores de contraseña para checklist reactivo
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [currPasswordVal, setCurrPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");

  // Switches
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [bioLockEnabled, setBioLockEnabled] = useState(false);

  // Estado de guardado de contraseña
  const [passState, setPassState] = useState<{ success?: string; error?: string } | null>(null);
  const [isSavingPass, setIsSavingPass] = useState(false);

  // Redirigir cuando el perfil básico es exitoso
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push("/perfil");
      }, 1500);
    }
  }, [state, router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    setIsUploadingAvatar(true);
    setAvatarMessage(null);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await updateAvatarAction(formData);
      setIsUploadingAvatar(false);

      if (result.success) {
        setAvatarMessage({ type: "success", text: result.message || "Foto actualizada" });
        setAvatarPreview(result.data);
      } else {
        setAvatarMessage({
          type: "error",
          text: result.message?.includes("Bucket")
            ? "El almacenamiento de avatares está en mantenimiento."
            : result.message || "Error al subir la imagen",
        });
        setAvatarPreview(profile.fotoperfil);
      }
    } catch {
      setIsUploadingAvatar(false);
      setAvatarMessage({ type: "error", text: "Error inesperado al subir la imagen." });
      setAvatarPreview(profile.fotoperfil);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPasswordVal) return;
    if (newPasswordVal.length < 6) {
      setPassState({ error: "La nueva contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      setPassState({ error: "Las contraseñas nuevas no coinciden." });
      return;
    }

    setIsSavingPass(true);
    setPassState(null);

    const formData = new FormData();
    formData.append("currentPassword", currPasswordVal);
    formData.append("newPassword", newPasswordVal);
    formData.append("confirmPassword", confirmPasswordVal);

    try {
      const res = await updatePasswordAction(null, formData);
      setIsSavingPass(false);
      if (res.error) {
        setPassState({ error: res.error });
      } else {
        setPassState({ success: "Contraseña actualizada exitosamente." });
        setCurrPasswordVal("");
        setNewPasswordVal("");
        setConfirmPasswordVal("");
      }
    } catch {
      setIsSavingPass(false);
      setPassState({ error: "Error al actualizar la contraseña." });
    }
  };

  const displayName = `${profile.nombre} ${profile.apellido}`.trim() || "Usuario HabitApp";
  const initials = `${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`.toUpperCase() || "HA";
  const userEmail = email || "usuario@ejemplo.com";

  // Checklist de contraseña
  const hasMinLength = newPasswordVal.length >= 6;
  const hasNumberOrSymbol = /[\d\W]/.test(newPasswordVal);

  return (
    <form action={formAction} className="flex flex-col gap-7">
      {/* ── 1. Profile Header Compact Card ── */}
      <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        {/* Interactive Avatar */}
        <div className="relative group cursor-pointer shrink-0" title="Haz clic para cambiar foto de perfil">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-1 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#111827] flex items-center justify-center overflow-hidden relative">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 select-none">
                  {initials}
                </span>
              )}

              {/* Hover overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Cambiar</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-transform group-hover:scale-105 cursor-pointer ring-2 ring-white dark:ring-[#111827]"
            aria-label="Subir foto de perfil"
          >
            <Camera className="w-4 h-4" aria-hidden="true" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Identity Info & Streak */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {displayName}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200/80 dark:border-amber-800/40">
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" aria-hidden="true" />
              <span>{racha} días de racha activa</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {userEmail}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Haz clic directamente sobre la foto para actualizarla en cualquier momento (máx. 5MB).
          </p>

          {avatarMessage && (
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                avatarMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
              }`}
            >
              {avatarMessage.text}
            </div>
          )}
        </div>
      </section>

      {/* ── 2. Card: Información Personal ── */}
      <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
        <div className="flex items-center gap-3.5 pb-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800/40">
            <Badge className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Información Personal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detalles esenciales de tu identidad y contacto en la plataforma
            </p>
          </div>
        </div>

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nombre" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              defaultValue={profile.nombre}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-[#111827] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              required
            />
            {state?.errors?.nombre && (
              <p className="text-[11px] text-rose-500 font-medium pl-1">{state.errors.nombre[0]}</p>
            )}
          </div>

          {/* Apellido */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="apellido" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              defaultValue={profile.apellido}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-[#111827] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              required
            />
            {state?.errors?.apellido && (
              <p className="text-[11px] text-rose-500 font-medium pl-1">{state.errors.apellido[0]}</p>
            )}
          </div>

          {/* Teléfono móvil */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="telefono" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Teléfono móvil
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              defaultValue={profile.telefono || ""}
              placeholder="+34 612 345 678"
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-[#111827] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Género */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="genero" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Género
            </label>
            <div className="relative flex items-center">
              <select
                id="genero"
                name="genero"
                defaultValue={profile.genero || ""}
                className="w-full h-11 px-4 pr-10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-[#111827] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="">Prefiero no responder</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">No binario / Otro</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fechanacimiento" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Fecha de nacimiento
            </label>
            <div className="relative flex items-center">
              <input
                id="fechanacimiento"
                name="fechanacimiento"
                type="date"
                defaultValue={profile.fechanacimiento || ""}
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-[#111827] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Correo Electrónico (Solo Lectura) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Correo Electrónico Vinculado
              </label>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Solo lectura
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                id="email"
                type="email"
                value={userEmail}
                readOnly
                className="w-full h-11 px-4 pr-10 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs sm:text-sm rounded-xl border border-slate-200/60 dark:border-slate-800 outline-none cursor-not-allowed select-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Card: Acceso y Seguridad ── */}
      <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
        <div className="flex items-center gap-3.5 pb-1">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-800/40">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Acceso y Seguridad
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protege tu cuenta y actualiza tus credenciales confidenciales
            </p>
          </div>
        </div>

        {/* Password Change Box */}
        <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Cambiar Contraseña
            </span>
            {newPasswordVal && (
              <button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={isSavingPass}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isSavingPass ? "Actualizando clave..." : "Guardar clave"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Contraseña actual */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="curr-pass" className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Contraseña actual
              </label>
              <div className="relative flex items-center">
                <input
                  id="curr-pass"
                  type={showCurrPass ? "text" : "password"}
                  value={currPasswordVal}
                  onChange={(e) => setCurrPasswordVal(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-3.5 pr-9 bg-white dark:bg-[#111827] text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrPass(!showCurrPass)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  aria-label="Ver u ocultar contraseña"
                >
                  {showCurrPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-pass" className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Nueva contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  id="new-pass"
                  type={showNewPass ? "text" : "password"}
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="w-full h-10 pl-3.5 pr-9 bg-white dark:bg-[#111827] text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  aria-label="Ver u ocultar contraseña"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-pass" className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Confirmar nueva contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirm-pass"
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPasswordVal}
                  onChange={(e) => setConfirmPasswordVal(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="w-full h-10 pl-3.5 pr-9 bg-white dark:bg-[#111827] text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  aria-label="Ver u ocultar contraseña"
                >
                  {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Checklist de requerimientos */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {hasMinLength ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" aria-hidden="true" />
              )}
              <span>Al menos 6 caracteres</span>
            </div>

            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                hasNumberOrSymbol ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {hasNumberOrSymbol ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" aria-hidden="true" />
              )}
              <span>Al menos un número o símbolo</span>
            </div>
          </div>

          {passState && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold ${
                passState.success
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
              }`}
            >
              {passState.success || passState.error}
            </div>
          )}
        </div>

        {/* Security Switches */}
        <div className="flex flex-col gap-4 divide-y divide-slate-100 dark:divide-slate-800">
          {/* 2FA Switch */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Autenticación en dos pasos (2FA)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Añade un código adicional vía SMS o App de autenticación al iniciar sesión.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-xs peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Biometric Switch */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Bloqueo biométrico rápido
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Permite autorizar cambios confidenciales usando Touch ID o Face ID en dispositivos compatibles.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
              <input
                type="checkbox"
                checked={bioLockEnabled}
                onChange={(e) => setBioLockEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-xs peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>
      </section>

      {/* ── 4. Action Bar & Footer Commit ── */}
      <section className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 max-w-md">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
          <span className="text-xs">
            Los cambios tendrán efecto inmediato en todos tus dispositivos sincronizados.
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Link
            href="/perfil"
            className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Descartar cambios
          </Link>

          <button
            type="submit"
            disabled={isPending || isUploadingAvatar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Guardando...</span>
              </>
            ) : state?.success ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>¡Guardado con éxito!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Mensaje Global de estado */}
      {state?.message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 ${
            state.success
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/40"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" aria-hidden="true" />
          ) : (
            <Info className="w-5 h-5 shrink-0 text-rose-500" aria-hidden="true" />
          )}
          <span>{state.message}</span>
        </div>
      )}
    </form>
  );
}
