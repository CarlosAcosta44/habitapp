import { requireUser } from "@/lib/supabase/server";
import { PerfilService } from "@/services/perfil.service";
import { EditProfileForm } from "@/components/perfil/EditProfileForm";
import Link from "next/link";

export const metadata = { title: "Editar Perfil | HabitApp" };

export default async function EditarPerfilPage() {
  const user = await requireUser();
  const perfilService = new PerfilService();
  
  const result = await perfilService.getProfileForEdit();
  
  if (!result.success) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-red-500 font-semibold">
        Error al cargar la información: {result.error}
      </div>
    );
  }

  const profile = result.data;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/ajustes" 
          className="p-2 rounded-full bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white italic">Editar Perfil</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Actualiza tu información pública y tu avatar.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/50 shadow-sm">
        <EditProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  );
}
