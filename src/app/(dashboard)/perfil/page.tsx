/**
 * @file src/app/(dashboard)/perfil/page.tsx
 * @description Página de Perfil del usuario. Refactorizada para usar PerfilService y subcomponentes.
 * @layer Presentation (Capa 1)
 */

import { requireUser } from "@/lib/supabase/server";
import { PerfilService } from "@/services/perfil.service";
import { PerfilHeader } from "@/components/perfil/PerfilHeader";
import { PerfilSidebar } from "@/components/perfil/PerfilSidebar";
import { PerfilTabs } from "@/components/perfil/PerfilTabs";
import { ActividadTab } from "@/components/perfil/ActividadTab";
import { AmigosTab } from "@/components/perfil/AmigosTab";
import { LogrosTab } from "@/components/perfil/LogrosTab";

export const metadata = { title: "Perfil | HabitApp" };

export default async function PerfilPage() {
  const user = await requireUser();
  const perfilService = new PerfilService();

  const result = await perfilService.getPerfilDashboardData(user.id);

  if (!result.success) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center text-red-500 font-semibold">
        Error al cargar la información del perfil: {result.error}
      </div>
    );
  }

  const data = result.data;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header del perfil */}
      <PerfilHeader perfil={data.perfil} rachaGlobal={data.rachaGlobal} />

      {/* Contenido con tabs + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content con tabs */}
        <div className="lg:col-span-2">
          <PerfilTabs tabs={["Actividad", "Amigos", "Logros"]}>
            {/* Tab: Actividad */}
            <ActividadTab actividad={data.actividad} />

            {/* Tab: Amigos */}
            <AmigosTab amigos={data.amigos} sugerenciasAmigos={data.sugerenciasAmigos} />

            {/* Tab: Logros */}
            <LogrosTab
              logros={data.logros}
              logroDestacado={data.logroDestacado}
              proximoObjetivo={data.proximoObjetivo}
              porcentajeObj={data.porcentajeObj}
            />
          </PerfilTabs>
        </div>

        {/* Sidebar derecho */}
        <PerfilSidebar
          diasActivosMensuales={data.diasActivosMensuales}
          diasEnElMes={data.diasEnElMes}
          eficienciaMensual={data.eficienciaMensual}
          proximoObjetivo={data.proximoObjetivo}
          amigos={data.amigos}
        />
      </div>
    </div>
  );
}
