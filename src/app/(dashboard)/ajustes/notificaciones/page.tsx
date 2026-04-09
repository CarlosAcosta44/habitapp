"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, BellOff, MessageSquare, Shield, CheckCircle2 } from "lucide-react";

export default function NotificacionesPage() {
  const [prefs, setPrefs] = useState({
    habits: true,
    community: true,
    challenges: true,
    marketing: false
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Cargar preferencias iniciales
  useEffect(() => {
    const savedPrefs = localStorage.getItem("notification_prefs");
    if (savedPrefs) {
      try {
        setPrefs(JSON.parse(savedPrefs));
      } catch (e) {
        console.error("Error loading prefs", e);
      }
    }
    setLoading(false);
  }, []);

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savePrefs = () => {
    localStorage.setItem("notification_prefs", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="p-12 text-center text-slate-500 italic">Cargando preferencias...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <Link 
          href="/ajustes" 
          className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 text-sm font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Ajustes
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white italic">Notificaciones</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Gestiona cómo y cuándo quieres recibir noticias de HabitApp.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            Preferencias de avisos
          </h2>

          <div className="space-y-6">
            {[
              { id: 'habits', title: 'Recordatorios de Hábitos', desc: 'Avisos cuando sea hora de completar una tarea.', icon: <Shield className="w-5 h-5" /> },
              { id: 'community', title: 'Actividad de Comunidad', desc: 'Nuevos comentarios y menciones en tus foros.', icon: <MessageSquare className="w-5 h-5" /> },
              { id: 'challenges', title: 'Retos y Misiones', desc: 'Actualizaciones sobre retos en los que participas.', icon: <Bell className="w-5 h-5" /> },
              { id: 'marketing', title: 'Novedades y Ofertas', desc: 'Información sobre nuevas funciones y promos.', icon: <BellOff className="w-5 h-5" /> }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.id as keyof typeof prefs)}
                  className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                    prefs[item.id as keyof typeof prefs] ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    prefs[item.id as keyof typeof prefs] ? "translate-x-5" : "translate-x-0"
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={savePrefs}
          className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            saved 
            ? "bg-emerald-600 text-white shadow-emerald-500/20 px-8" 
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-5 h-5 animate-bounce" />
              ¡Preferencias Guardadas!
            </>
          ) : (
            "Guardar Preferencias"
          )}
        </button>
      </div>
    </div>
  );
}
