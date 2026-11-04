/**
 * @file src/app/(dashboard)/perfil/page.tsx
 * @description Página de Perfil del usuario. Refactorizada para usar PerfilService y subcomponentes.
 * @layer Presentation (Capa 1)
 */

import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { UsuarioService } from "@/services/usuario.service";
import { HabitoService } from "@/services/habito.service";
import { PerfilInteractiveView } from "@/components/perfil/PerfilInteractiveView";

export const metadata = {
  title: "Perfil de Usuario | HabitApp",
  description: "Gestiona tu identidad, revisa tus logros de bienestar y conecta con tu comunidad de hábitos diarios.",
};

export default async function PerfilPage() {
  await requireUser();
  const perfilService = new UsuarioService();
  const habitoService = new HabitoService();

  const [result, habitosRes] = await Promise.all([
    perfilService.getPerfilDashboardData(),
    habitoService.getAll("Activo"),
  ]);

  if (!result.success) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center text-red-500 font-semibold">
        Error al cargar la información del perfil: {result.error}
      </div>
    );
  }

  const activeHabitsCount =
    habitosRes.success && Array.isArray(habitosRes.data) ? habitosRes.data.length : 6;

  const data = {
    ...result.data,
    totalHabitosActivos: activeHabitsCount,
  };

  return <PerfilInteractiveView data={data} />;
}
