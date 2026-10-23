'use client';

import React, { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Tag,
  Bookmark,
  Share2,
  MoreVertical,
  Heart,
  MessageCircle,
  Reply,
  Send,
  ChevronDown,
  ChevronUp,
  Smile,
  CheckCircle2,
  Loader2,
  Trash2,
  Edit3,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import {
  comentarAction,
  reaccionarAction,
  deleteComentarioAction,
  deleteForoAction,
  updateComentarioAction,
  uploadComunidadImageAction,
} from '@/actions/comunidad.actions';
import { EditForoModal } from '@/components/modals/EditForoModal';
import { ComentarioPadreCard } from '@/components/comunidad/ComentarioPadreCard';

interface Comentario {
  idcomentario?: string;
  idComentario?: string;
  id?: string;
  idusuario?: string;
  contenido: string;
  fechaPublicacion?: string;
  fechapublicacion?: string;
  fechacreacion?: string;
  idcomentario_padre?: string | null;
  idComentarioPadre?: string | null;
  parentId?: string | null;
  likes_count?: number;
  liked_by_me?: boolean;
  imagen_url?: string | null;
  imagenUrl?: string | null;
  usuarios?: {
    idusuario?: string;
    nombre?: string;
    apellido?: string;
    fotoperfil?: string;
  };
  autor?: {
    id?: string;
    nombre: string;
    apellido?: string;
    avatarUrl?: string;
    rol?: string;
  };
  respuestas?: Comentario[];
}

interface ForoDetalleProps {
  foro: any;
  initialComentarios: Comentario[];
  currentUser?: {
    id?: string;
    nombre?: string;
    apellido?: string;
    rol?: string;
  };
  isAdmin?: boolean;
}

export function ForoDetalleInteractiveView({
  foro,
  initialComentarios = [],
  currentUser,
  isAdmin = false,
}: ForoDetalleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Estados locales
  const [newCommentText, setNewCommentText] = useState('');
  const [commentImage, setCommentImage] = useState('');
  const [isUploadingCommentImage, setIsUploadingCommentImage] = useState(false);
  const commentFileInputRef = useRef<HTMLInputElement>(null);

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState('');
  const [isUploadingReplyImage, setIsUploadingReplyImage] = useState(false);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  const [hiddenThreads, setHiddenThreads] = useState<Record<string, boolean>>({});

  // Likes locales optimistas
  const foroId = foro?.idforo || foro?.idForo || foro?.id || '';
  const [foroLikes, setForoLikes] = useState<number>(foro?.likes_count ?? foro?.reacciones?.meGusta ?? 24);
  const [hasLikedForo, setHasLikedForo] = useState<boolean>(foro?.liked_by_me ?? false);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  // Feedback y toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Menús desplegables y edición
  const [isForoMenuOpen, setIsForoMenuOpen] = useState(false);
  const [isEditForoOpen, setIsEditForoOpen] = useState(false);
  const [openMenuCommentId, setOpenMenuCommentId] = useState<string | null>(null);

  // Edición inline de comentarios
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [isSavingCommentEdit, setIsSavingCommentEdit] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Organizar comentarios en árbol (padres e hijos) ──
  const { comentariosPadre, respuestasMap } = React.useMemo(() => {
    const padres: Comentario[] = [];
    const respuestas: Record<string, Comentario[]> = {};

    initialComentarios.forEach((c) => {
      const pid = c.idcomentario_padre || c.idComentarioPadre || c.parentId;
      if (!pid) {
        padres.push(c);
      } else {
        if (!respuestas[pid]) respuestas[pid] = [];
        respuestas[pid].push(c);
      }
    });

    return { comentariosPadre: padres, respuestasMap: respuestas };
  }, [initialComentarios]);

  // ── Toggle Like en Foro Principal ──
  const handleLikeForo = () => {
    if (!foroId) return;
    const nextState = !hasLikedForo;
    setHasLikedForo(nextState);
    setForoLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    startTransition(async () => {
      await reaccionarAction('foro', foroId, 'like');
    });
  };

  // ── Toggle Like en Comentario ──
  const handleLikeComentario = (cId: string, currentCount: number) => {
    const isLiked = likedComments[cId];
    const nextState = !isLiked;
    setLikedComments((prev) => ({ ...prev, [cId]: nextState }));
    setCommentLikes((prev) => ({
      ...prev,
      [cId]: (prev[cId] ?? currentCount) + (nextState ? 1 : -1),
    }));

    startTransition(async () => {
      await reaccionarAction('comentario', cId, 'like');
    });
  };

  // ── Manejo de subida de imagen para comentario principal ──
  const handleSelectCommentImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no debe superar los 5 MB');
      return;
    }

    try {
      setIsUploadingCommentImage(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadComunidadImageAction(fd);
      if (res.success && res.url) {
        setCommentImage(res.url);
        showToast('Imagen adjuntada correctamente 🖼️');
      } else {
        showToast(res.message || 'Error al subir la imagen');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error al procesar la imagen');
    } finally {
      setIsUploadingCommentImage(false);
      if (commentFileInputRef.current) commentFileInputRef.current.value = '';
    }
  };

  // ── Manejo de subida de imagen para respuesta ──
  const handleSelectReplyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no debe superar los 5 MB');
      return;
    }

    try {
      setIsUploadingReplyImage(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadComunidadImageAction(fd);
      if (res.success && res.url) {
        setReplyImage(res.url);
        showToast('Imagen adjuntada a la respuesta 🖼️');
      } else {
        showToast(res.message || 'Error al subir la imagen');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error al procesar la imagen');
    } finally {
      setIsUploadingReplyImage(false);
      if (replyFileInputRef.current) replyFileInputRef.current.value = '';
    }
  };

  // ── Publicar Comentario Principal ──
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newCommentText.trim() && !commentImage.trim()) || !foroId) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.set('idForo', foroId);
      fd.set('contenido', newCommentText.trim());
      if (commentImage.trim()) {
        fd.set('imagenUrl', commentImage.trim());
      }

      const res = await comentarAction(null, fd);
      if (res.success) {
        setNewCommentText('');
        setCommentImage('');
        showToast('Respuesta publicada exitosamente ✨');
        router.refresh();
      } else {
        showToast(res.message || 'Error al publicar respuesta');
      }
    });
  };

  // ── Publicar Sub-respuesta Anidada ──
  const handlePostReply = (parentId: string) => {
    if ((!replyText.trim() && !replyImage.trim()) || !foroId) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.set('idForo', foroId);
      fd.set('contenido', replyText.trim());
      fd.set('idComentarioPadre', parentId);
      if (replyImage.trim()) {
        fd.set('imagenUrl', replyImage.trim());
      }

      const res = await comentarAction(null, fd);
      if (res.success) {
        setReplyText('');
        setReplyImage('');
        setReplyingToId(null);
        showToast('Respuesta añadida al hilo');
        router.refresh();
      } else {
        showToast(res.message || 'Error al responder');
      }
    });
  };

  // ── Eliminar foro ──
  const handleDeleteForo = () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este foro? Esta acción no se puede deshacer.')) return;
    startTransition(async () => {
      const res = await deleteForoAction(foroId);
      if (res.success) {
        showToast('Foro eliminado con éxito');
        router.push('/comunidad');
      } else {
        showToast(res.message || 'Error al eliminar el foro');
      }
    });
  };

  // ── Eliminar comentario ──
  const handleDeleteComment = (cId: string) => {
    if (!confirm('¿Eliminar este comentario? Esta acción no se puede deshacer.')) return;
    startTransition(async () => {
      const res = await deleteComentarioAction(cId, foroId);
      if (res.success) {
        showToast('Comentario eliminado');
        router.refresh();
      } else {
        showToast(res.message || 'Error al eliminar comentario');
      }
    });
  };

  // ── Guardar edición de comentario ──
  const handleSaveCommentEdit = (cId: string) => {
    if (!editingContent.trim()) return;
    setIsSavingCommentEdit(true);
    startTransition(async () => {
      const res = await updateComentarioAction(cId, editingContent.trim(), foroId);
      setIsSavingCommentEdit(false);
      if (res.success) {
        setEditingCommentId(null);
        showToast('Comentario actualizado con éxito ✨');
        router.refresh();
      } else {
        showToast(res.message || 'Error al actualizar comentario');
      }
    });
  };

  // Formato de fecha
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Reciente';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return 'Ahora mismo';
    if (diffMin < 60) return `hace ${diffMin} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    return `hace ${diffDays} días`;
  };

  const getInitials = (name?: string, lastName?: string) => {
    const f = name ? name[0].toUpperCase() : 'U';
    const l = lastName ? lastName[0].toUpperCase() : '';
    return `${f}${l}` || 'HB';
  };

  const autorNombre = foro?.usuarios
    ? `${foro.usuarios.nombre || ''} ${foro.usuarios.apellido || ''}`.trim()
    : foro?.autor?.nombre
    ? `${foro.autor.nombre || ''} ${foro.autor.apellido || ''}`.trim()
    : 'Miembro de la Comunidad';

  const renderSubRespuesta = (sub: any) => {
    const sId = sub.idcomentario || sub.idComentario || sub.id || '';
    const sIsLiked = likedComments[sId] || false;
    const sLikes = commentLikes[sId] ?? sub.likes_count ?? 3;
    const subAutorNombre = sub.usuarios
      ? `${sub.usuarios.nombre || ''} ${sub.usuarios.apellido || ''}`.trim()
      : sub.autor?.nombre
      ? `${sub.autor.nombre} ${sub.autor.apellido || ''}`.trim()
      : 'Miembro';
    const subAvatar = sub.usuarios?.fotoperfil || sub.autor?.avatarUrl;
    const subImg = sub.imagen_url || sub.imagenUrl;
    const canManageSub = Boolean(isAdmin || (currentUser?.id && (sub.idusuario === currentUser.id || sub.usuarios?.idusuario === currentUser.id)));

    return (
      <div
        key={sId}
        className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {subAvatar ? (
              <img
                src={subAvatar}
                alt={subAutorNombre}
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                {getInitials(sub.usuarios?.nombre || sub.autor?.nombre, sub.usuarios?.apellido || sub.autor?.apellido)}
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {subAutorNombre}
              </span>
              <span className="text-[11px] text-slate-400">
                • {formatTimeAgo(sub.fechapublicacion || sub.fechaPublicacion || sub.fechacreacion)}
              </span>
            </div>
          </div>

          {canManageSub && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenuCommentId(openMenuCommentId === sId ? null : sId)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Opciones de respuesta"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              {openMenuCommentId === sId && (
                <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-[#151c2c] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuCommentId(null);
                      setEditingCommentId(sId);
                      setEditingContent(sub.contenido || '');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar respuesta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuCommentId(null);
                      handleDeleteComment(sId);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left border-t border-slate-100 dark:border-slate-800/60"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Eliminar respuesta</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editingCommentId === sId ? (
          <div className="flex flex-col gap-2 pl-9 pt-1">
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              rows={2}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#572de4] resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isSavingCommentEdit}
                onClick={() => setEditingCommentId(null)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSavingCommentEdit || !editingContent.trim()}
                onClick={() => handleSaveCommentEdit(sId)}
                className="px-3.5 py-1 rounded-lg bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
              >
                {isSavingCommentEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                <span>Guardar</span>
              </button>
            </div>
          </div>
        ) : (
          sub.contenido && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
              {sub.contenido}
            </p>
          )
        )}

        {subImg && (
          <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 max-h-56 w-full max-w-xs bg-slate-100 dark:bg-slate-900 shadow-sm mt-1 ml-9">
            <img
              src={subImg}
              alt="Imagen adjunta en respuesta"
              className="w-full h-full object-cover max-h-56"
            />
          </div>
        )}

        <div className="flex items-center gap-3 pl-9 pt-0.5">
          <button
            type="button"
            onClick={() => handleLikeComentario(sId, sub.likes_count ?? 3)}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
              sIsLiked
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-400 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${sIsLiked ? 'fill-current' : ''}`} />
            <span>{sLikes}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Sub-header / Barra Superior de Navegación ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/comunidad"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#572de4] dark:text-indigo-400 font-semibold text-xs transition-colors shadow-sm border border-slate-200/80 dark:border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Foros de Apoyo</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
            <Tag className="w-3.5 h-3.5" />
            <span>{foro?.categoria || 'General'}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tema Activo</span>
          </span>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              showToast(isBookmarked ? 'Tema quitado de guardados' : 'Tema guardado en tu colección');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isBookmarked
                ? 'bg-indigo-50 dark:bg-indigo-950 text-[#572de4] dark:text-indigo-300'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Guardado' : 'Guardar'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                void navigator.clipboard.writeText(window.location.href);
                showToast('Enlace copiado al portapapeles 📋');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      {/* ── OP Post Header Card ── */}
      <article className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#572de4] via-indigo-500 to-violet-500" />

        {/* Fila del autor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {foro?.usuarios?.fotoperfil || foro?.autor?.avatarUrl ? (
              <img
                src={foro?.usuarios?.fotoperfil || foro?.autor?.avatarUrl}
                alt={autorNombre}
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-indigo-100 dark:ring-indigo-900/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#572de4] to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-indigo-100 dark:ring-indigo-900/50">
                {getInitials(foro?.usuarios?.nombre || foro?.autor?.nombre, foro?.usuarios?.apellido || foro?.autor?.apellido)}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {autorNombre}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                  Autora
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {formatTimeAgo(foro?.fechacreacion || foro?.fechaPublicacion)} • Comunidad HabitApp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs">
              <span>{initialComentarios.length + 12} lecturas</span>
            </span>

            {Boolean(currentUser?.id && (foro?.idusuario === currentUser.id || isAdmin)) && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsForoMenuOpen(!isForoMenuOpen)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Opciones del foro"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {isForoMenuOpen && (
                  <div className="absolute right-0 top-9 z-20 w-36 bg-white dark:bg-[#151c2c] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-1 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForoMenuOpen(false);
                        setIsEditForoOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar foro</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleDeleteForo}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left disabled:opacity-50 border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar foro</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Título del post */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
          {foro?.titulo || 'Conversación Comunitaria'}
        </h1>

        {/* Cuerpo del post */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {foro?.descripcion || 'Comparte tus experiencias e ideas en este espacio seguro.'}
        </p>

        {/* Imagen adjunta en el post si existe */}
        {foro?.imagen_url && (
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 max-h-96 w-full bg-slate-100 dark:bg-slate-900 shadow-sm">
            <img
              src={foro.imagen_url}
              alt="Imagen del foro"
              className="w-full h-full object-cover max-h-96"
            />
          </div>
        )}

        {/* Context Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
            #{foro?.categoria?.replace(/\s+/g, '') || 'Bienestar'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
            #ApoyoMutuo
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
            #SaludEmocional
          </span>
        </div>

        {/* Barra de interacción */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLikeForo}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-bold active:scale-95 shadow-sm ${
                hasLikedForo
                  ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLikedForo ? 'fill-current' : ''}`} />
              <span>{foroLikes} apoyos</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              <MessageCircle className="w-4 h-4 text-slate-400" />
              <span>{initialComentarios.length} respuestas</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              replyInputRef.current?.focus();
              replyInputRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Reply className="w-4 h-4" />
            <span>Responder al hilo</span>
          </button>
        </div>
      </article>

      {/* ── Sección de Respuestas y Comentarios ── */}
      <section className="flex flex-col gap-5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Respuestas de la Comunidad
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
              {initialComentarios.length} respuestas
            </span>
          </div>
        </div>

        {/* ── Caja integrada para publicar respuesta principal ── */}
        <form
          id="reply-box"
          onSubmit={handlePostComment}
          className="bg-white dark:bg-[#111827] rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3.5 focus-within:ring-2 focus-within:ring-[#572de4]/20 transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#572de4] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {getInitials(currentUser?.nombre, currentUser?.apellido)}
            </div>
            <div className="flex-1">
              <textarea
                ref={replyInputRef}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={3}
                placeholder="Escribe una respuesta empática o un consejo para la comunidad..."
                className="w-full bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 rounded-2xl p-3.5 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Input oculto para adjuntar imagen desde el dispositivo */}
          <input
            ref={commentFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectCommentImage}
          />

          {/* Preview o loader de la imagen adjunta en comentario */}
          {(isUploadingCommentImage || commentImage) && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 animate-in fade-in">
              {isUploadingCommentImage ? (
                <div className="flex items-center gap-2 text-xs text-[#572de4] dark:text-indigo-400 font-semibold py-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subiendo imagen desde tu dispositivo...</span>
                </div>
              ) : (
                <div className="relative group w-24 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={commentImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCommentImage('')}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
                    title="Quitar imagen"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => commentFileInputRef.current?.click()}
                disabled={isUploadingCommentImage}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  commentImage
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Adjuntar imagen desde tu dispositivo"
              >
                {isUploadingCommentImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {commentImage ? 'Cambiar imagen' : 'Adjuntar imagen'}
                </span>
              </button>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                Sé amable y respetuoso con la comunidad 🌱
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending || (!newCommentText.trim() && !commentImage.trim())}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 ml-auto"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Publicar respuesta</span>
            </button>
          </div>
        </form>

        {/* ── Lista de Comentarios e Hilos Anidados ── */}
        <div className="flex flex-col gap-4 pt-2">
          {comentariosPadre.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Aún no hay respuestas en este foro
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Sé la primera persona en compartir una palabra de apoyo o un consejo útil.
              </p>
            </div>
          ) : (
            comentariosPadre.map((comentario) => {
              const cId = comentario.idcomentario || comentario.idComentario || comentario.id || '';
              return (
                <ComentarioPadreCard
                  key={cId}
                  comentario={comentario}
                  subRespuestas={respuestasMap[cId] || []}
                  isHidden={hiddenThreads[cId] || false}
                  isReplyingThis={replyingToId === cId}
                  isLiked={likedComments[cId] || false}
                  likesCount={commentLikes[cId] ?? comentario.likes_count ?? 8}
                  isAdmin={isAdmin}
                  currentUser={currentUser}
                  openMenuCommentId={openMenuCommentId}
                  editingCommentId={editingCommentId}
                  editingContent={editingContent}
                  isSavingCommentEdit={isSavingCommentEdit}
                  replyText={replyText}
                  replyImage={replyImage}
                  isUploadingReplyImage={isUploadingReplyImage}
                  isPending={isPending}
                  replyFileInputRef={replyFileInputRef}
                  setOpenMenuCommentId={setOpenMenuCommentId}
                  setEditingCommentId={setEditingCommentId}
                  setEditingContent={setEditingContent}
                  setReplyingToId={setReplyingToId}
                  setReplyText={setReplyText}
                  setReplyImage={setReplyImage}
                  setHiddenThreads={setHiddenThreads}
                  handleDeleteComment={handleDeleteComment}
                  handleSaveCommentEdit={handleSaveCommentEdit}
                  handleLikeComentario={handleLikeComentario}
                  handlePostReply={handlePostReply}
                  handleSelectReplyImage={handleSelectReplyImage}
                  formatTimeAgo={formatTimeAgo}
                  getInitials={getInitials}
                  renderSubRespuesta={renderSubRespuesta}
                />
              );
            })
          )}
        </div>
      </section>

      {/* ── Modal para Editar Foro ── */}
      <EditForoModal
        isOpen={isEditForoOpen}
        onClose={() => setIsEditForoOpen(false)}
        foro={foro}
        onSuccess={() => {
          showToast('Foro actualizado con éxito ✨');
          router.refresh();
        }}
      />
    </div>
  );
}
