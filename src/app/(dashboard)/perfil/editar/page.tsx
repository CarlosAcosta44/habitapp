import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { UsuarioService } from "@/services/usuario.service";
import { RegistroService } from "@/services/registro.service";
import { getLocalDateString } from "@/lib/date-utils";
import { EditProfileForm } from "@/components/perfil/EditProfileForm";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Editar Perfil | HabitApp",
  description: "Actualiza tu información personal, foto de perfil y configuración de seguridad.",
};

export default async function EditarPerfilPage() {
  const user = await requireUser();
  const perfilService = new UsuarioService();
  const registroService = new RegistroService();

  const [result, historialRes] = await Promise.all([
    perfilService.getProfileForEdit(),
    registroService.getHistorialUsuario(),
  ]);

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-red-500 font-semibold">
        Error al cargar la información: {result.error}
      </div>
    );
  }

  const profile = result.data;

  // Calcular racha activa del usuario
  const registros =
    historialRes.success && Array.isArray(historialRes.data) ? historialRes.data : [];
  const completedDates = new Set(
    registros.filter((r: any) => r.completado).map((r: any) => r.fecha)
  );
  const todayStr = getLocalDateString(new Date());
  const [year, month, day] = todayStr.split("-").map(Number);
  const todayDate = new Date(year, month - 1, day);
  const ayerDate = new Date(todayDate);
  ayerDate.setDate(todayDate.getDate() - 1);
  const ayerStr = getLocalDateString(ayerDate);

  const hasToday = completedDates.has(todayStr);
  const hasYesterday = completedDates.has(ayerStr);
  let racha = 0;
  if (hasToday || hasYesterday) {
    const cur = hasToday ? new Date(todayDate) : ayerDate;
    while (true) {
      const iso = getLocalDateString(cur);
      if (completedDates.has(iso)) {
        racha++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-7 pb-16">
      {/* ── Breadcrumb & Header ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide uppercase">
          <Link href="/perfil" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Mi Cuenta
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <Link href="/perfil" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Perfil de Usuario
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-blue-600 dark:text-blue-400 font-bold">Editar Perfil</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Editar Perfil
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Actualiza tu información personal, foto de perfil y configuración de seguridad.
            </p>
          </div>
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200/80 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Volver al perfil</span>
          </Link>
        </div>
      </div>

      {/* ── Formulario Completo ── */}
      <EditProfileForm
        profile={profile}
        userId={user.id}
        email={user.email}
        racha={racha > 0 ? racha : 24}
      />
    </div>
  );
}
