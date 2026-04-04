/**
 * @file src/app/(dashboard)/comunidad/foros/[id]/page.tsx
 * @description Detalle de un foro con comentarios anidados.
 */

import { createClient }     from "@/lib/supabase/server";
import { redirect }         from "next/navigation";
import { ComunidadService } from "@/modules/comunidad/comunidad.service";
import { ComentarioItem }   from "@/components/comunidad/ComentarioItem";
import { ComentarioForm }   from "@/components/comunidad/ComentarioForm";
import Link                 from "next/link";

const comunidadService = new ComunidadService();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ForoDetallePage({ params }: PageProps) {
  const { id: foroId } = await params;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const comentariosResult = await comunidadService.getComentarios(foroId);
  const comentarios = comentariosResult.success ? comentariosResult.data : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/comunidad"
          aria-label="Volver a comunidad"
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Foro
        </h1>
      </div>

      {/* Formulario nuevo comentario */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Nuevo comentario
        </h2>
        <ComentarioForm foroId={foroId} />
      </div>

      {/* Lista de comentarios */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Comentarios ({comentarios.length})
        </h2>

        {comentarios.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Sé el primero en comentar
            </p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <ComentarioItem
              key={comentario.idComentario}
              comentario={comentario}
              foroId={foroId}
            />
          ))
        )}
      </section>
    </div>
  );
}