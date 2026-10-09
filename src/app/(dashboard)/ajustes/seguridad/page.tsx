import { requireUserStrict } from "@/lib/auth/require-user";
import { SeguridadForm } from "./SeguridadForm";

export const metadata = { title: "Seguridad y Perfil | HabitApp" };

export default async function SeguridadPage() {
  const user = await requireUserStrict();

  const initialName = user.nombre || "";
  const initialLastName = user.apellido || "";
  const initialEmail = user.email || "";

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
