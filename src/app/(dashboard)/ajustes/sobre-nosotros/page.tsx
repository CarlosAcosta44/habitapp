import { SobreNosotrosClient } from "./SobreNosotrosClient";

export const metadata = { title: "Sobre Nosotros | HabitApp" };

export default function SobreNosotrosPage() {
  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-4">
      <SobreNosotrosClient />
    </div>
  );
}
