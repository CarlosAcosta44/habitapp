'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Articulo } from '@/domain/comunidad.types';
import {
  X,
  BookOpen,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Award,
  Sparkles,
  Bookmark,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface ArticleReaderModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly articulo: Articulo | null;
}

const CATEGORIA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Nutrición: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'Actividad Física': { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  Ejercicio: { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  'Salud Mental': { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  Sueño: { bg: 'bg-violet-50 dark:bg-violet-950/60', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' },
  Salud: { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  default: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
};

export function ArticleReaderModal({ isOpen, onClose, articulo }: ArticleReaderModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevenir scroll del body mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isMounted || !isOpen || !articulo) return null;

  const categoria = articulo.categoria || 'Salud y Hábitos';
  const categoryTheme = CATEGORIA_COLORS[categoria] || CATEGORIA_COLORS.default;

  // Cálculo de tiempo de lectura
  const texto = articulo.contenido || '';
  const wordCount = texto.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  // Formato de fecha
  const fechaStr = (articulo as Record<string, any>).fechapublicacion || articulo.fechaPublicacion || 'Reciente';

  // Separar en párrafos legibles con id estable
  const rawParagraphs = texto
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  const artId = (articulo as any).idArticulo || (articulo as any).idarticulo || (articulo as any).id || 'art';
  const paragraphs = rawParagraphs.map((p: string, idx: number) => ({
    id: `${artId}-p-${idx}-${p.slice(0, 16)}`,
    text: p,
    isFirst: idx === 0,
    isHeading: p.startsWith('#') || (p.length < 50 && p.endsWith(':')),
  }));

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return createPortal(
    <dialog
      open
      aria-labelledby="article-reader-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-transparent animate-in fade-in duration-200 w-full h-full max-w-none max-h-none m-0 border-0"
    >
      <button
        type="button"
        aria-label="Cerrar artículo"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md -z-10 cursor-default"
      />

      {/* Reader Container */}
      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#151c2c]/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryTheme.bg} ${categoryTheme.text} ${categoryTheme.border} flex items-center gap-1.5`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{categoria}</span>
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTime} min de lectura</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copiar enlace"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setBookmarked((prev) => !prev)}
              title="Guardar artículo"
              className={`p-2 rounded-xl transition-colors ${
                bookmarked
                  ? 'text-[#572de4] bg-indigo-50 dark:bg-indigo-950/80'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ml-1"
              aria-label="Cerrar artículo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Article Header info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {fechaStr}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Revisión Editorial y Clínica
              </span>
            </div>

            <h1
              id="article-reader-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
            >
              {articulo.titulo}
            </h1>

            {/* Author / Specialist Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#572de4] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  HA
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Equipo Clínico HabitApp
                    </span>
                    <Award className="w-3.5 h-3.5 text-[#572de4] dark:text-indigo-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Especialistas en neurobiología de hábitos y bienestar integral
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block">
                Guía Práctica
              </span>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Formatted Content */}
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
            {paragraphs.length > 0 ? (
              paragraphs.map((p) => {
                if (p.isHeading) {
                  return (
                    <h3
                      key={p.id}
                      className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-2"
                    >
                      {p.text.replace(/^#+\s*/, '')}
                    </h3>
                  );
                }

                if (p.isFirst) {
                  return (
                    <p
                      key={p.id}
                      className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed"
                    >
                      {p.text}
                    </p>
                  );
                }

                return (
                  <p key={p.id} className="leading-relaxed">
                    {p.text}
                  </p>
                );
              })
            ) : (
              <p className="text-slate-500 italic">No hay contenido disponible para este artículo.</p>
            )}
          </div>

          {/* Key Takeaways Callout Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3 mt-6">
            <div className="flex items-center gap-2 text-[#572de4] dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Puntos Clave para tu Rutina
              </h4>
            </div>
            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-[#572de4] shrink-0 mt-0.5" />
                <span>La consistencia diaria supera a los esfuerzos intensos esporádicos.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-[#572de4] shrink-0 mt-0.5" />
                <span>Alinea tus hábitos con señales del entorno para reducir la fricción cognitiva.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-[#572de4] shrink-0 mt-0.5" />
                <span>Celebra pequeñas victorias para retroalimentar el sistema de dopamina.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#151c2c]/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between sticky bottom-0 z-20">
          <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            ¿Te sirvió este contenido? Compártelo en los foros comunitarios.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Enlace copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
