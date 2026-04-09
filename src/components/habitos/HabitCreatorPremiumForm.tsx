"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Bell,
  BookOpen,
  Droplets,
  Dumbbell,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { createHabitoAction } from "@/modules/habitos/habito.actions";
import type { CategoriaHabito } from "@/modules/habitos/types";

interface HabitCreatorPremiumFormProps {
  categorias: CategoriaHabito[];
}

export function HabitCreatorPremiumForm({ categorias }: HabitCreatorPremiumFormProps) {
  const [state, formAction, isPending] = useActionState(createHabitoAction, null);
  const [habitName, setHabitName] = useState("Caminar");
  const [descripcion, setDescripcion] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-[#A2AAFD]");
  const [frequency, setFrequency] = useState("Todos los dias");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categorias[0]?.idCategoria ?? "");
  const [selectedIcon, setSelectedIcon] = useState("activity");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["Manana"]);

  const hoy = new Date().toISOString().split("T")[0];
  const puntos = Math.min(100, Math.max(1, timesPerDay * 10));

  const icons = [
    { id: "activity", Cmp: Activity },
    { id: "droplets", Cmp: Droplets },
    { id: "book", Cmp: BookOpen },
    { id: "dumbbell", Cmp: Dumbbell },
    { id: "moon", Cmp: Moon },
    { id: "sun", Cmp: Sun },
  ];

  const colors = ["bg-[#A2AAFD]", "bg-[#FF99C2]", "bg-[#8D89FF]", "bg-[#FF6B80]", "bg-[#70F1C4]", "bg-[#FDE06F]"];
  const SelectedIconComponent = icons.find((item) => item.id === selectedIcon)?.Cmp ?? Activity;
  const selectedCategoriaLabel = useMemo(
    () => categorias.find((item) => item.idCategoria === selectedCategoryId)?.nombre ?? "Sin categoria",
    [categorias, selectedCategoryId]
  );

  const handleTimeToggle = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((item) => item !== time) : [...prev, time]
    );
  };

  return (
    <form action={formAction} className="min-h-screen w-full bg-[#0A0718] text-slate-200 flex justify-center">
      <input type="hidden" name="nombre" value={habitName} />
      <input type="hidden" name="descripcion" value={descripcion} />
      <input type="hidden" name="idCategoria" value={selectedCategoryId} />
      <input type="hidden" name="fechaInicio" value={hoy} />
      <input type="hidden" name="puntos" value={puntos} />

      <div className="flex flex-col lg:flex-row w-full max-w-[1300px]">
        <div className="flex-1 lg:max-w-[760px] border-r border-slate-800 p-6 lg:p-12">
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Link
                href="/habitos"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold tracking-wide text-white">Crear habito personalizado</h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Search size={16} />
              <Bell size={16} />
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#9DA8FF] uppercase mb-4">01 Informacion basica</h2>
            <label className="block text-sm text-slate-400 mb-3">Como se llama tu nuevo habito?</label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full bg-[#161433] text-white border border-transparent focus:border-[#9DA8FF] rounded-2xl px-6 py-4 outline-none transition font-medium"
              placeholder="Ej. Caminar"
            />
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full mt-3 bg-[#161433] text-white border border-transparent focus:border-[#9DA8FF] rounded-2xl px-6 py-4 outline-none transition text-sm resize-none"
              placeholder="Descripcion opcional"
              rows={2}
            />
          </section>

          <section className="mb-8">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#9DA8FF] uppercase mb-4">02 Identidad visual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#161433] p-6 rounded-[1.8rem]">
                <p className="text-xs text-slate-400 mb-4 font-medium">Selecciona un icono</p>
                <div className="grid grid-cols-4 gap-3">
                  {icons.map(({ id, Cmp }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedIcon(id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedIcon === id ? "bg-[#A2AAFD] text-slate-900" : "bg-[#1F1D44] text-slate-400 hover:text-white"}`}
                    >
                      <Cmp size={18} />
                    </button>
                  ))}
                  <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1F1D44] text-slate-400">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-[#161433] p-6 rounded-[1.8rem]">
                <p className="text-xs text-slate-400 mb-4 font-medium">Personaliza el color</p>
                <div className="grid grid-cols-4 gap-3">
                  {colors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-transform ${color} ${selectedColor === color ? "scale-110 ring-4 ring-[#1A183A]" : ""}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-5 mb-2 font-medium">Categoria</p>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full rounded-xl bg-[#1F1D44] border border-[#2B2960] text-sm text-slate-200 px-3 py-2.5 outline-none"
                >
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#9DA8FF] uppercase mb-4">03 Meta y frecuencia</h2>
            <div className="bg-[#161433] p-6 rounded-[1.8rem] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Repetir habito</p>
                  <p className="text-xs text-slate-400">Con que frecuencia lo realizaras?</p>
                </div>
                <div className="flex bg-[#1F1D44] rounded-full p-1 border border-[#2A2755]">
                  <button type="button" onClick={() => setFrequency("Todos los dias")} className={`px-4 py-2 rounded-full text-xs font-semibold ${frequency === "Todos los dias" ? "bg-[#9DA8FF] text-slate-900" : "text-slate-300"}`}>Todos los dias</button>
                  <button type="button" onClick={() => setFrequency("Dias selectos")} className={`px-4 py-2 rounded-full text-xs font-semibold ${frequency === "Dias selectos" ? "bg-[#9DA8FF] text-slate-900" : "text-slate-300"}`}>Dias selectos</button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Meta diaria</p>
                  <p className="text-xs text-slate-400">Numero de veces por jornada</p>
                </div>
                <div className="flex items-center gap-4 bg-[#1F1D44] rounded-full px-3 py-1.5 border border-[#2A2755]">
                  <button type="button" className="w-7 h-7 rounded-full bg-[#2C2A58]" onClick={() => setTimesPerDay((prev) => Math.max(1, prev - 1))}>-</button>
                  <span className="font-bold text-lg">{timesPerDay}</span>
                  <button type="button" className="w-7 h-7 rounded-full bg-[#2C2A58]" onClick={() => setTimesPerDay((prev) => prev + 1)}>+</button>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">vez al dia</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#9DA8FF] uppercase mb-4">04 Recordatorios</h2>
            <div className="bg-[#161433] p-6 rounded-[1.8rem]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2A1D3A] text-[#FF99C2] flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Notificaciones activas</p>
                    <p className="text-xs text-slate-400">Te avisaremos para que no lo olvides</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled((prev) => !prev)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? "bg-[#9DA8FF]" : "bg-slate-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationsEnabled ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "Manana", label: "MANANA", time: "08:00" },
                  { key: "Tarde", label: "TARDE", time: "14:30" },
                  { key: "Noche", label: "NOCHE", time: "20:00" },
                ].map((slot) => {
                  const active = selectedTimes.includes(slot.key);
                  return (
                    <button
                      key={slot.key}
                      type="button"
                      onClick={() => handleTimeToggle(slot.key)}
                      className={`rounded-2xl p-3 text-left transition border ${active ? "border-[#9DA8FF] bg-[#1A183A]" : "border-transparent bg-[#1A183A]/60 opacity-60 hover:opacity-100"}`}
                    >
                      <p className="text-[10px] tracking-wider text-slate-400">{slot.label}</p>
                      <p className="text-xl font-bold text-white mt-1">{slot.time}</p>
                    </button>
                  );
                })}
                <button type="button" className="rounded-2xl p-3 border border-dashed border-slate-600 text-center">
                  <Plus className="h-4 w-4 mx-auto text-slate-400" />
                  <p className="text-[10px] tracking-wider text-slate-400 mt-2">NUEVO</p>
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex-1 p-6 lg:p-12 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-8 shadow-2xl lg:mt-24">
            <div className="flex justify-between items-start mb-10">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-slate-900 ${selectedColor}`}>
                <SelectedIconComponent size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-widest text-slate-400 uppercase font-bold mb-1">Progreso</p>
                <p className="text-2xl font-black text-slate-900">0%</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{habitName || "Nuevo habito"}</h3>
            <p className="text-sm text-slate-500 mb-2">{timesPerDay} vez al dia, {frequency.toLowerCase()}</p>
            <p className="text-xs text-slate-400">Categoria: {selectedCategoriaLabel}</p>
            <div className="flex items-center gap-3 mt-5">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-[#1A183A] border-2 border-white text-[9px] text-white flex items-center justify-center">+12</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Comenzando hoy</span>
            </div>
          </div>

          <div className="bg-[#161433] rounded-[32px] p-8 text-center">
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
              Al crear este habito, se anadira automaticamente a tu tablero principal y podras empezar a registrarlo desde hoy.
            </p>
            <button
              type="submit"
              disabled={isPending || !selectedCategoryId}
              className="w-full bg-[#9DA8FF] hover:bg-indigo-300 text-slate-950 font-bold py-4 rounded-full mb-3 transition-all disabled:opacity-50"
            >
              {isPending ? "Creando..." : "Agregar habito"}
            </button>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Guardar como borrador</p>
            {state && !state.success && (
              <p className="text-xs text-red-400 mt-3">{state.message}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
