"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { updatePerfilBasicoAction, updateAvatarAction } from "@/actions/perfil.actions";
import type { ProfileForEdit } from "@/types/domain/perfil.types";
import { useRouter } from "next/navigation";

interface Props {
  profile: ProfileForEdit;
  userId: string;
}

export function EditProfileForm({ profile, userId }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updatePerfilBasicoAction, null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.fotoperfil);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    // Crear preview local instantáneo
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Iniciar carga al servidor
    setIsUploadingAvatar(true);
    setAvatarMessage(null);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await updateAvatarAction(formData);
      
      setIsUploadingAvatar(false);
      
      if (result.success) {
        setAvatarMessage({ type: 'success', text: result.message });
        setAvatarPreview(result.data); // URL pública real
      } else {
        // Manejo específico del bucket
        if (result.message?.includes('Bucket not found') || (result as any).error?.includes('Bucket not found') || result.message?.includes('Storage')) {
          setAvatarMessage({ type: 'error', text: "La subida de imágenes está en mantenimiento." });
        } else {
          setAvatarMessage({ type: 'error', text: result.message || "Error al subir la imagen" });
        }
        setAvatarPreview(profile.fotoperfil); // Revertir si falla
      }
    } catch (error) {
      setIsUploadingAvatar(false);
      setAvatarMessage({ type: 'error', text: "La subida de imágenes está en mantenimiento." });
      setAvatarPreview(profile.fotoperfil); // Revertir si falla
    }
  };

  return (
    <div className="space-y-8">
      {/* ── SECCIÓN DE AVATAR ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 bg-slate-800 flex items-center justify-center shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-slate-400">
                {profile.nombre.charAt(0)}{profile.apellido.charAt(0)}
              </span>
            )}
            
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Foto de Perfil</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
            Sube una imagen en formato JPG, PNG o WebP. Tamaño máximo recomendado: 5MB.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="px-5 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold text-sm rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Cambiar Foto
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          {avatarMessage && (
            <div className={`mt-3 px-3 py-2 rounded-lg inline-block text-sm font-medium ${avatarMessage.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
              {avatarMessage.text}
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── FORMULARIO BÁSICO ── */}
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-bold text-slate-700 dark:text-slate-300">Nombre</label>
            <input 
              id="nombre"
              name="nombre"
              type="text"
              defaultValue={profile.nombre}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state?.errors?.nombre && (
              <p className="text-xs text-red-500 font-medium pl-1">{state.errors.nombre[0]}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="apellido" className="text-sm font-bold text-slate-700 dark:text-slate-300">Apellido</label>
            <input 
              id="apellido"
              name="apellido"
              type="text"
              defaultValue={profile.apellido}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state?.errors?.apellido && (
              <p className="text-xs text-red-500 font-medium pl-1">{state.errors.apellido[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="telefono" className="text-sm font-bold text-slate-700 dark:text-slate-300">Teléfono</label>
            <input 
              id="telefono"
              name="telefono"
              type="text"
              defaultValue={profile.telefono || ""}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state?.errors?.telefono && (
              <p className="text-xs text-red-500 font-medium pl-1">{state.errors.telefono[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="genero" className="text-sm font-bold text-slate-700 dark:text-slate-300">Género</label>
            <select
              id="genero"
              name="genero"
              defaultValue={profile.genero || ""}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
            >
              <option value="">Prefiero no decirlo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            {state?.errors?.genero && (
              <p className="text-xs text-red-500 font-medium pl-1">{state.errors.genero[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="fechanacimiento" className="text-sm font-bold text-slate-700 dark:text-slate-300">Fecha de Nacimiento</label>
            <input 
              id="fechanacimiento"
              name="fechanacimiento"
              type="date"
              defaultValue={profile.fechanacimiento || ""}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state?.errors?.fechanacimiento && (
              <p className="text-xs text-red-500 font-medium pl-1">{state.errors.fechanacimiento[0]}</p>
            )}
          </div>
        </div>

        {/* Mensaje Global */}
        {state?.message && (
          <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${state.success ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {state.success ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              )}
            </svg>
            {state.message}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={isPending || isUploadingAvatar}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center min-w-[160px] disabled:opacity-70 disabled:shadow-none"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
