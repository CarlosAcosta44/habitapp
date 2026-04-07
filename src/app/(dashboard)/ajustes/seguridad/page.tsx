import { createClient } from "@/lib/supabase/server";
import { SeguridadForm } from "./SeguridadForm";
import { redirect } from "next/navigation";

export const metadata = { title: "Seguridad y Perfil | HabitApp" };

export default async function SeguridadPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Obtenemos los meta datos básicos de auth (donde habitualmente se guardó el registro inicial)
  const meta = user.user_metadata || {};
  const initialName = meta.nombre || "John";
  const initialLastName = meta.apellido || "Doe";
  const initialEmail = user.email || "correo@ejemplo.com";

  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-4">
      <SeguridadForm 
        initialName={initialName}
        initialLastName={initialLastName}
        initialEmail={initialEmail}
      />
    </div>
  );
}
