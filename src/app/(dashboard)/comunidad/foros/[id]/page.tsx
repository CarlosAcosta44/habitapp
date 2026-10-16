/**
 * @file src/app/(dashboard)/comunidad/foros/[id]/page.tsx
 * @description Detalle de un foro con hilos anidados e interacciones.
 */

import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { ComunidadService } from "@/services/comunidad.service";
import { ForoDetalleInteractiveView } from "@/components/comunidad/ForoDetalleInteractiveView";
import { notFound } from "next/navigation";

export const metadata = { title: "Detalle de Foro | HabitApp" };

const comunidadService = new ComunidadService();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ForoDetallePage({ params }: PageProps) {
  const { id: foroId } = await params;

  await requireUser();
  const { UsuarioService } = await import("@/services/usuario.service");
  const usuarioService = new UsuarioService();
  const profileResult = await usuarioService.getPerfilMe();
  const profile = profileResult.success ? profileResult.data : null;
  const isAdmin = profile?.nombrerol?.toUpperCase() === "ADMINISTRADOR";

  // Obtener datos del foro y comentarios en paralelo
  const [foroResult, comentariosResult] = await Promise.all([
    comunidadService.getForoById(foroId),
    comunidadService.getComentarios(foroId),
  ]);

  const foro = foroResult.success && foroResult.data ? foroResult.data : null;
  if (!foro) {
    notFound();
  }

  const comentarios = comentariosResult.success && Array.isArray(comentariosResult.data)
    ? comentariosResult.data
    : [];

  return (
    <ForoDetalleInteractiveView
      foro={foro}
      initialComentarios={comentarios}
      currentUser={{
        id: profile?.idusuario,
        nombre: profile?.nombre || "Tú",
        apellido: profile?.apellido || "",
        rol: profile?.nombrerol,
      }}
      isAdmin={isAdmin}
    />
  );
}