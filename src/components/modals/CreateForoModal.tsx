'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  X,
  MessageSquarePlus,
  Sparkles,
  Heart,
  Loader2,
  AlertCircle,
  Tag,
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { createForoAction, uploadComunidadImageAction } from '@/actions/comunidad.actions';

interface CreateForoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIAS = [
  { id: 'Ansiedad', label: '#Ansiedad' },
  { id: 'Mindfulness', label: '#Mindfulness' },
  { id: 'Autoestima', label: '#Autoestima' },
  { id: 'Sueño', label: '#Sueño' },
  { id: 'Hábitos', label: '#Hábitos' },
  { id: 'Crecimiento personal', label: '#Crecimiento personal' },
  { id: 'Nutrición', label: '#Nutrición' },
  { id: 'Estrés', label: '#Estrés' },
];

export function CreateForoModal({ isOpen, onClose }: CreateForoModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Ansiedad');
  const [imagenUrl, setImagenUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitulo('');
      setDescripcion('');
      setCategoria('Ansiedad');
      setImagenUrl('');
      setIsUploadingImage(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setErrorMsg(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadComunidadImageAction(fd);
      if (res.success && res.url) {
        setImagenUrl(res.url);
      } else {
        setErrorMsg(res.message || 'Error al subir la imagen');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al procesar la imagen');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (titulo.trim().length < 5) {
      setErrorMsg('El título debe tener al menos 5 caracteres.');
      return;
    }

    if (descripcion.trim().length < 10) {
      setErrorMsg('La descripción debe tener al menos 10 caracteres.');
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set('titulo', titulo.trim().substring(0, 45));
      fd.set('descripcion', descripcion.trim());
      const cleanCat = categoria.trim().replace(/^#+/, '').substring(0, 45) || 'General';
      fd.set('categoria', cleanCat);
      if (imagenUrl) {
        fd.set('imagenUrl', imagenUrl);
      }

      const res = await createForoAction(null, fd);
      if (res.success) {
        onClose();
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Error al crear el foro');
      }
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-[0_20px_50px_rgba(87,45,228,0.2)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Crear un Foro
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#572de4]/10 text-[#572de4] dark:bg-indigo-950/80 dark:text-indigo-300">
                  Comunidad
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inicia una conversación, comparte reflexiones o pide apoyo en un entorno seguro.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Categoría / Hashtag libre */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#572de4]" />
                <span>Categoría o Hashtag</span>
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                Máx. 45 caracteres (ej: #Productividad)
              </span>
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">
                #
              </span>
              <input
                type="text"
                value={categoria.replace(/^#/, '')}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/^#+/, '').replace(/\s+/g, '_');
                  setCategoria(cleaned ? `#${cleaned}` : '');
                }}
                maxLength={45}
                placeholder="Escribe tu categoría (ej: Ansiedad, MiRutina, Enfoque...)"
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4]"
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Sugerencias populares:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {CATEGORIAS.map((cat) => {
                  const currentNorm = categoria.replace(/^#/, '').toLowerCase();
                  const catNorm = cat.id.replace(/^#/, '').toLowerCase();
                  const isSelected = currentNorm === catNorm;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoria(cat.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#572de4] text-white shadow-sm scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Título de la conversación (máx. 45 caracteres)
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: ¿Cómo lidiar con el sobrepensamiento?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4]"
              maxLength={45}
              required
            />
            <span className="text-[11px] text-slate-400 text-right">
              {titulo.length}/45
            </span>
          </div>

          {/* Descripción / Reflexión */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tu mensaje o reflexión
            </label>
            <textarea
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Explica tu situación o pregunta con empatía y claridad. La comunidad está aquí para apoyarte..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4] resize-none"
              maxLength={2000}
              required
            />
            <span className="text-[11px] text-slate-400 text-right">
              {descripcion.length}/2000
            </span>
          </div>

          {/* Imagen adjunta desde explorador de archivos */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#572de4]" />
                <span>Imagen adjunta (opcional)</span>
              </span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {imagenUrl ? (
              <div className="relative w-full max-w-xs h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img src={imagenUrl} alt="Vista previa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagenUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#572de4] dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#572de4]" />
                    <span>Subiendo imagen a la nube...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-[#572de4]" />
                    <span>Subir imagen desde tu dispositivo</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Banner de espacio seguro */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Espacio Seguro &amp; Respetuoso
              </span>
              <p className="text-[11px] leading-relaxed">
                Todas las aportaciones en HabitApp deben seguir principios de empatía, sin juicios y con respeto mutuo hacia la salud emocional de cada persona.
              </p>
            </div>
          </div>

          {/* Footer de botones */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Publicar Foro</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
