'use client';

import React from 'react';
import {
  Heart,
  Reply,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit3,
  Trash2,
  Loader2,
  ImageIcon,
  Send,
  X,
} from 'lucide-react';

interface ComentarioPadreCardProps {
  readonly comentario: any;
  readonly subRespuestas: any[];
  readonly isHidden: boolean;
  readonly isReplyingThis: boolean;
  readonly isLiked: boolean;
  readonly likesCount: number;
  readonly isAdmin: boolean;
  readonly currentUser: any;
  readonly openMenuCommentId: string | null;
  readonly editingCommentId: string | null;
  readonly editingContent: string;
  readonly isSavingCommentEdit: boolean;
  readonly replyText: string;
  readonly replyImage: string;
  readonly isUploadingReplyImage: boolean;
  readonly isPending: boolean;
  readonly replyFileInputRef: React.RefObject<HTMLInputElement | null>;
  readonly setOpenMenuCommentId: (id: string | null) => void;
  readonly setEditingCommentId: (id: string | null) => void;
  readonly setEditingContent: (val: string) => void;
  readonly setReplyingToId: (id: string | null) => void;
  readonly setReplyText: (val: string) => void;
  readonly setReplyImage: (val: string) => void;
  readonly setHiddenThreads: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  readonly handleDeleteComment: (cId: string) => void;
  readonly handleSaveCommentEdit: (cId: string) => void;
  readonly handleLikeComentario: (cId: string, initial: number) => void;
  readonly handlePostReply: (cId: string) => void;
  readonly handleSelectReplyImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly formatTimeAgo: (date?: string) => string;
  readonly getInitials: (nombre?: string, apellido?: string) => string;
  readonly renderSubRespuesta: (sub: any) => React.ReactNode;
}

function getAutorNombre(comentario: any): string {
  if (comentario?.usuarios?.nombre) {
    return `${comentario.usuarios.nombre} ${comentario.usuarios.apellido || ''}`.trim();
  }
  if (comentario?.autor?.nombre) {
    return `${comentario.autor.nombre} ${comentario.autor.apellido || ''}`.trim();
  }
  return 'Miembro';
}

export function ComentarioPadreCard({
  comentario,
  subRespuestas,
  isHidden,
  isReplyingThis,
  isLiked,
  likesCount,
  isAdmin,
  currentUser,
  openMenuCommentId,
  editingCommentId,
  editingContent,
  isSavingCommentEdit,
  replyText,
  replyImage,
  isUploadingReplyImage,
  isPending,
  replyFileInputRef,
  setOpenMenuCommentId,
  setEditingCommentId,
  setEditingContent,
  setReplyingToId,
  setReplyText,
  setReplyImage,
  setHiddenThreads,
  handleDeleteComment,
  handleSaveCommentEdit,
  handleLikeComentario,
  handlePostReply,
  handleSelectReplyImage,
  formatTimeAgo,
  getInitials,
  renderSubRespuesta,
}: ComentarioPadreCardProps) {
  const cId = comentario.idcomentario || comentario.idComentario || comentario.id || '';
  const cAutorNombre = getAutorNombre(comentario);
  const cAvatar = comentario.usuarios?.fotoperfil || comentario.autor?.avatarUrl;
  const cImg = comentario.imagen_url || comentario.imagenUrl;
  const canManageParent = Boolean(
    isAdmin ||
    (currentUser?.id && (comentario.idusuario === currentUser.id || comentario.usuarios?.idusuario === currentUser.id))
  );

  return (
    <article
      key={cId}
      className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      {/* Cabecera del comentario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {cAvatar ? (
            <img
              src={cAvatar}
              alt={cAutorNombre}
              className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-[#572de4] dark:text-indigo-400 flex items-center justify-center font-bold text-xs shadow-sm">
              {getInitials(
                comentario.usuarios?.nombre || comentario.autor?.nombre,
                comentario.usuarios?.apellido || comentario.autor?.apellido
              )}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {cAutorNombre}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">• Miembro activo</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatTimeAgo(comentario.fechapublicacion || comentario.fechaPublicacion || comentario.fechacreacion)}
            </span>
          </div>
        </div>

        {canManageParent && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenuCommentId(openMenuCommentId === cId ? null : cId)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Opciones de comentario"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {openMenuCommentId === cId && (
              <div className="absolute right-0 top-9 z-20 w-40 bg-white dark:bg-[#151c2c] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-1 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuCommentId(null);
                    setEditingCommentId(cId);
                    setEditingContent(comentario.contenido || '');
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar comentario</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuCommentId(null);
                    handleDeleteComment(cId);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left border-t border-slate-100 dark:border-slate-800/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar comentario</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Texto del comentario o editor inline */}
      {editingCommentId === cId ? (
        <div className="flex flex-col gap-2 pt-1">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={3}
            className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#572de4] resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSavingCommentEdit}
              onClick={() => setEditingCommentId(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSavingCommentEdit || !editingContent.trim()}
              onClick={() => handleSaveCommentEdit(cId)}
              className="px-4 py-1.5 rounded-lg bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSavingCommentEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Guardar cambios</span>
            </button>
          </div>
        </div>
      ) : (
        comentario.contenido && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {comentario.contenido}
          </p>
        )
      )}

      {/* Imagen adjunta en comentario */}
      {cImg && (
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 max-h-72 w-full max-w-md bg-slate-100 dark:bg-slate-900 shadow-sm mt-1">
          <img
            src={cImg}
            alt="Imagen adjunta en comentario"
            className="w-full h-full object-cover max-h-72"
          />
        </div>
      )}

      {/* Barra de interacciones y toggle de respuestas */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleLikeComentario(cId, comentario.likes_count ?? 8)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isLiked
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount} apoyos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setReplyingToId(isReplyingThis ? null : cId);
              setReplyText('');
              setReplyImage('');
            }}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#572de4] dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Responder</span>
          </button>
        </div>

        {subRespuestas.length > 0 && (
          <button
            type="button"
            onClick={() =>
              setHiddenThreads((prev) => ({ ...prev, [cId]: !prev[cId] }))
            }
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#572de4] dark:text-indigo-400 hover:underline"
          >
            {isHidden ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Ver respuestas ({subRespuestas.length})</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Ocultar respuestas ({subRespuestas.length})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Formulario Inline para responder a este comentario */}
      {isReplyingThis && (
        <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Respondiendo a <strong>{cAutorNombre}</strong>:</span>
            <button
              type="button"
              onClick={() => setReplyingToId(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Cancelar
            </button>
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Escribe tu respuesta a este comentario..."
            className="w-full bg-white dark:bg-slate-900 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 outline-none resize-none"
          />

          {/* Input oculto para adjuntar imagen en respuesta */}
          <input
            ref={replyFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectReplyImage}
          />

          {(isUploadingReplyImage || replyImage) && (
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in">
              {isUploadingReplyImage ? (
                <div className="flex items-center gap-2 text-xs text-[#572de4] dark:text-indigo-400 font-semibold py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo imagen...</span>
                </div>
              ) : (
                <div className="relative group w-20 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={replyImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setReplyImage('')}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
                    title="Quitar imagen"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => replyFileInputRef.current?.click()}
              disabled={isUploadingReplyImage}
              className="text-xs text-slate-500 hover:text-[#572de4] flex items-center gap-1"
            >
              {isUploadingReplyImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" />
              )}
              <span>{replyImage ? 'Cambiar imagen' : 'Adjuntar imagen'}</span>
            </button>

            <button
              type="button"
              disabled={isPending || (!replyText.trim() && !replyImage.trim())}
              onClick={() => handlePostReply(cId)}
              className="px-4 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Enviar respuesta</span>
            </button>
          </div>
        </div>
      )}

      {/* Hilo Anidado de Respuestas */}
      {!isHidden && subRespuestas.length > 0 && (
        <div className="flex flex-col gap-3 pl-4 sm:pl-6 ml-2 sm:ml-4 border-l-2 border-slate-200 dark:border-slate-800 pt-1">
          {subRespuestas.map(renderSubRespuesta)}
        </div>
      )}
    </article>
  );
}
