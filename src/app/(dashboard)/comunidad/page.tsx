/**
 * @file src/app/(dashboard)/comunidad/page.tsx
 * @description Página principal de la comunidad — vista completa.
 * Hero section, explorar hábitos, foros, directorio de profesionales,
 * artículos destacados y CTA de newsletter.
 */

import { createClient }       from "@/lib/supabase/server";
import { redirect }           from "next/navigation";
import { ComunidadService }   from "@/services/comunidad.service";
import { ExplorarHabitos }    from "@/components/comunidad/ExplorarHabitos";
import { ForoComunidadCard }  from "@/components/comunidad/ForoComunidadCard";
import { DirectorioProfesionales } from "@/components/comunidad/DirectorioProfesionales";
import { ArticuloDestacado }  from "@/components/comunidad/ArticuloDestacado";

export const metadata = { title: "Comunidad | HabitApp" };

const comunidadService = new ComunidadService();

export default async function ComunidadPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // ── Obtener datos en paralelo ────────────────────────────────────────────
  const [forosResult, articulosResult, entrenadoresResult] = await Promise.all([
    comunidadService.getForos(session.user.id),
    comunidadService.getArticulos(4),
    comunidadService.getEntrenadores(),
  ]);

  const foros        = forosResult.success        ? forosResult.data        : [];
  const articulos    = articulosResult.success     ? articulosResult.data    : [];
  const entrenadores = entrenadoresResult.success  ? entrenadoresResult.data : [];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">

      {/* ── Barra de búsqueda ─────────────────────────────────────────────── */}
      <div className="relative max-w-lg">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar en la comunidad..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Crea, Comparte<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
            & Conecta.
          </span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-3 max-w-md">
          Únete a miles de personas que están transformando sus vidas a través
          de hábitos sostenibles y apoyo mutuo.
        </p>
      </section>

      {/* ── Explorar Hábitos (Tendencias) ─────────────────────────────────── */}
      <ExplorarHabitos />

      {/* ── Foros de la Comunidad ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          Foros de la Comunidad
        </h2>

        {foros.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-slate-400 font-medium">
              No hay foros disponibles todavía
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foros.slice(0, 6).map((foro) => (
              <ForoComunidadCard key={foro.idForo} foro={foro} />
            ))}
          </div>
        )}
      </section>

      {/* ── Directorio de Profesionales ───────────────────────────────────── */}
      <DirectorioProfesionales entrenadores={entrenadores} />

      {/* ── Artículos Destacados ──────────────────────────────────────────── */}
      {articulos.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Artículos Destacados
            </h2>
            <span className="text-sm text-slate-400">
              Lectura de 5 min
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articulos.slice(0, 4).map((articulo) => (
              <ArticuloDestacado key={articulo.idArticulo} articulo={articulo} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Newsletter ────────────────────────────────────────────────── */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900"></div>
        <div className="relative px-8 py-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            ¿Listo para transformar tu vida?
          </h3>
          <p className="text-sm text-indigo-200 mb-6 max-w-md mx-auto">
            Únete a nuestra newsletter semanal y recibe consejos exclusivos de
            expertos directamente en tu correo.
          </p>
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-indigo-300/50 focus:outline-none focus:border-indigo-400/50 transition-all"
            />
            <button className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}