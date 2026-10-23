'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  X,
  Edit3,
  Loader2,
  AlertCircle,
  Tag,
  Image as ImageIcon,
  Trash2,
  Save,
} from 'lucide-react';
import { updateForoAction, uploadComunidadImageAction } from '@/actions/comunidad.actions';

interface EditForoModalProps {
  isOpen: boolean;
  onClose: () => void;
  foro: any;
  onSuccess?: () => void;
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

export function EditForoModal({ isOpen, onClose, foro, onSuccess }: EditForoModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const foroId = foro?.idforo || foro?.idForo || foro?.id;

  const [titulo, setTitulo] = useState(foro?.titulo || '');
  const [descripcion, setDescripcion] = useState(foro?.descripcion || '');
  const [categoria, setCategoria] = useState(foro?.categoria || 'Ansiedad');
  const [imagenUrl, setImagenUrl] = useState(foro?.imagen_url || foro?.imagenUrl || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && foro) {
      setTitulo(foro.titulo || '');
      setDescripcion(foro.descripcion || '');
      setCategoria(foro.categoria || 'Ansiedad');
      setImagenUrl(foro.imagen_url || foro.imagenUrl || '');
      setIsUploadingImage(false);
      setErrorMsg(null);
    }
  }, [isOpen, foro]);

  if (!isOpen || !isMounted || !foroId) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La imagen no puede pesar más de 5MB');
      return;
    }

    setIsUploadingImage(true);
    setErrorMsg(null);

    const fd = new FormData();
    fd.append('file', file);

    const res = await uploadComunidadImageAction(fd);
    setIsUploadingImage(false);

    if (res.success && res.url) {
      setImagenUrl(res.url);
    } else {
      setErrorMsg(res.message || 'Error al subir la imagen');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || titulo.trim().length < 5) {
      setErrorMsg('El título debe tener al menos 5 caracteres');
      return;
    }
    if (titulo.length > 45) {
      setErrorMsg('El título no puede superar los 45 caracteres');
      return;
    }
    if (!descripcion.trim() || descripcion.trim().length < 10) {
      setErrorMsg('La descripción debe tener al menos 10 caracteres');
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await updateForoAction(foroId, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        imagenUrl: imagenUrl || undefined,
      });

      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Error al actualizar el foro');
      }
    });
  };

  const modalContent = (
    <dialog
      open
      aria-labelledby="edit-foro-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 w-full h-full max-w-none max-h-none m-0 border-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="edit-foro-title" className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Editar Foro
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modifica el título, la categoría o el contenido de tu publicación
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#572de4]" />
              <span>Categoría Temática *</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoria(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    categoria === cat.id
                      ? 'bg-[#572de4] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="edit-foro-input-titulo" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Título del Foro *
              </label>
              <span className={`text-[11px] font-semibold ${titulo.length > 45 ? 'text-rose-500' : 'text-slate-400'}`}>
                {titulo.length}/45
              </span>
            </div>
            <input
              id="edit-foro-input-titulo"
              type="text"
              value={titulo}
              maxLength={45}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Estrategias para calmar la mente en las noches"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4]"
              required
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-foro-input-descripcion" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Contenido de la publicación *
            </label>
            <textarea
              id="edit-foro-input-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escribe tu reflexión, pregunta o experiencia..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4] resize-none"
              required
            />
          </div>

          {/* Imagen Adjunta */}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {imagenUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 group">
                <img src={imagenUrl} alt="Imagen del foro" className="w-full h-full object-cover max-h-48" />
                <button
                  type="button"
                  onClick={() => setImagenUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                  title="Quitar imagen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full py-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#572de4] text-slate-500 dark:text-slate-400 hover:text-[#572de4] text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#572de4]" />
                    <span>Subiendo imagen...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Cambiar o adjuntar imagen (opcional)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
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
              disabled={isPending || isUploadingImage}
              className="px-5 py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );

  return createPortal(modalContent, document.body);
}
