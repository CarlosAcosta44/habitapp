/**
 * @file src/app/(dashboard)/comunidad/page.tsx
 * @description Centro neurálgico de Comunidad & Bienestar — HabitApp.
 * Vista interactiva completa con datos reales, búsqueda con ⌘K, filtros de foros,
 * clonación de hábitos, unión a retos y directorio de especialistas.
 */

import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { ComunidadService } from "@/services/comunidad.service";
import { HabitoService } from "@/services/habito.service";
import { UsuarioService } from "@/services/usuario.service";
import { ComunidadInteractiveView } from "@/components/comunidad/ComunidadInteractiveView";

export const metadata = {
  title: "Comunidad & Bienestar | HabitApp",
  description: "Espacio seguro y colaborativo para compartir rutinas, debatir y conectar con profesionales.",
};

const comunidadService = new ComunidadService();
const habitoService = new HabitoService();
const usuarioService = new UsuarioService();

export default async function ComunidadPage() {
  const user = await requireUser();

  // ── Obtener datos reales en paralelo para máxima velocidad ───────────────────
  const [
    forosRes,
    habitosRes,
    articulosRes,
    especialistasRes,
    retosRes,
    userHabitosRes,
    profileRes,
    statsRes,
  ] = await Promise.all([
    comunidadService.getForos(),
    comunidadService.getHabitosComunidad(),
    comunidadService.getArticulos(),
    comunidadService.getEspecialistas(),
    comunidadService.getRetos(),
    habitoService.getAll("Activo"),
    usuarioService.getPerfilMe(),
    comunidadService.getStats(),
  ]);

  const foros = forosRes.success && Array.isArray(forosRes.data) ? forosRes.data : [];
  const habitosComunidad = habitosRes.success && Array.isArray(habitosRes.data) ? habitosRes.data : [];
  const articulos = articulosRes.success && Array.isArray(articulosRes.data) ? articulosRes.data : [];
  const especialistas = especialistasRes.success && Array.isArray(especialistasRes.data) ? especialistasRes.data : [];
  const retos = retosRes.success && Array.isArray(retosRes.data) ? retosRes.data : [];
  const userHabitos = userHabitosRes.success && Array.isArray(userHabitosRes.data) ? userHabitosRes.data : [];

  const profile = profileRes.success ? profileRes.data : null;
  const isAdmin = profile?.nombrerol?.toUpperCase() === "ADMINISTRADOR";
  const totalMiembros = statsRes.success && statsRes.data?.totalMiembros ? statsRes.data.totalMiembros : 30;

  return (
    <ComunidadInteractiveView
      initialForos={foros}
      initialHabitosComunidad={habitosComunidad}
      initialArticulos={articulos}
      initialEspecialistas={especialistas}
      initialRetos={retos}
      userHabitos={userHabitos}
      userId={user.id}
      isAdmin={isAdmin}
      totalMiembros={totalMiembros}
    />
  );
}