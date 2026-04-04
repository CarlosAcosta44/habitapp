/**
 * @file src/app/(dashboard)/habitos/nueva/page.tsx
 * @description Página para crear un nuevo hábito.
 * Server Component que carga las categorías y pasa al formulario cliente.
 */

import { createClient }  from "@/lib/supabase/server";
import { redirect }      from "next/navigation";
import { HabitoService } from "@/modules/habitos/habito.service";
import { HabitForm }     from "@/components/habitos/HabitForm";
import Link              from "next/link";

export const metadata = { title: "Nuevo Hábito | HabitApp" };

const habitoService = new HabitoService();

export default async function NuevoHabitoPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // Cargar categorías para el select del formulario
  const categoriasResult = await habitoService.getCategorias();
  const categorias = categoriasResult.success ? categoriasResult.data : [];

  return (
    <div className="max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/habitos"
          aria-label="Volver a hábitos"
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Nuevo Hábito
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Define tu nuevo hábito saludable
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
        {categorias.length === 0 ? (
          <p className="text-center text-slate-400 py-8">
            No se pudieron cargar las categorías
          </p>
        ) : (
          <HabitForm categorias={categorias} />
        )}
      </div>
    </div>
  );
}