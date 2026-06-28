"use client";

import React, { useEffect, useState } from 'react';
import { coachService, CoachClient, CoachRoutine } from '@/services/coach.service';
import { 
  Users, 
  Dumbbell, 
  PlusCircle, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react';

export default function CoachDashboardPage() {
  const [clients, setClients] = useState<CoachClient[]>([]);
  const [routines, setRoutines] = useState<CoachRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAssigning, setIsAssigning] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [newRoutineData, setNewRoutineData] = useState({ name: '', description: '' });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsRes, routinesRes] = await Promise.all([
        coachService.getClients(),
        coachService.getRoutines()
      ]);

      if (!clientsRes.success) {
        setError(clientsRes.error || "Error al cargar pupilos.");
        return;
      }
      if (!routinesRes.success) {
        setError(routinesRes.error || "Error al cargar rutinas.");
        return;
      }
      
      setClients(clientsRes.data);
      setRoutines(routinesRes.data);
    } catch (e: any) {
      setError(e.message || "Error inesperado de red.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineData.name) return;

    setIsLoading(true);
    const result = await coachService.createRoutine({
      name: newRoutineData.name,
      description: newRoutineData.description,
      habits: [] // Opcional: Se podrían agregar hábitos desde el modal
    });

    if (result.success) {
      setRoutines([result.data, ...routines]);
      setNewRoutineData({ name: '', description: '' });
      setShowNewRoutine(false);
      showToast('success', 'Rutina creada con éxito');
    } else {
      showToast('error', result.error || 'No se pudo crear la rutina');
    }
    setIsLoading(false);
  };

  const handleAssignRoutine = async (routineId: string) => {
    const clientId = window.prompt("Ingresa el ID del cliente al cual asignar esta rutina (Cópialo de la lista de pupilos):");
    if (!clientId) return;

    setIsAssigning(routineId);
    const result = await coachService.assignRoutine(clientId, routineId);
    
    if (result.success) {
      showToast('success', 'Rutina asignada exitosamente al pupilo');
    } else {
      showToast('error', result.error || 'Error al asignar la rutina');
    }
    setIsAssigning(null);
  };

  if (isLoading && clients.length === 0 && routines.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Skeleton Header */}
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64 animate-pulse mb-8" />
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/50">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error de Acceso</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={fetchData} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toastMessage.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{toastMessage.text}</p>
        </div>
      )}

      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Dumbbell className="w-8 h-8 text-indigo-500" />
          Panel de Entrenador
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Gestiona tus rutinas maestras y supervisa el progreso de tus pupilos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Rutinas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-500" />
              Tus Rutinas ({routines.length})
            </h2>
            <button 
              onClick={() => setShowNewRoutine(!showNewRoutine)}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Nueva Rutina
            </button>
          </div>

          {showNewRoutine && (
            <form onSubmit={handleCreateRoutine} className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-indigo-200 dark:border-indigo-500/30 p-6 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Crear Plantilla de Rutina</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre de la Rutina</label>
                  <input required value={newRoutineData.name} onChange={e => setNewRoutineData({...newRoutineData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="Ej: Hipertrofia Tren Superior" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
                  <textarea value={newRoutineData.description} onChange={e => setNewRoutineData({...newRoutineData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 min-h-[80px]" placeholder="Breve descripción..." />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Guardar Rutina
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.map(routine => (
              <div key={routine.id} className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm hover:border-indigo-500/50 transition-colors group">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{routine.name}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{routine.description || 'Sin descripción'}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{routine.routine_habits?.length || 0} hábitos</span>
                  <button 
                    onClick={() => handleAssignRoutine(routine.id)}
                    disabled={isAssigning === routine.id}
                    className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    {isAssigning === routine.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Asignar a pupilo'}
                  </button>
                </div>
              </div>
            ))}
            {routines.length === 0 && !showNewRoutine && (
              <div className="col-span-1 md:col-span-2 text-center p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-slate-500">
                No has creado ninguna rutina aún.
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Pupilos */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Tus Pupilos ({clients.length})
          </h2>

          <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
            {clients.map(({ client }) => (
              <div key={client.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shrink-0">
                    {client.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{client.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{client.email}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded-xl text-center text-slate-500 break-all select-all cursor-text">
                  ID: {client.id}
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                Aún no tienes pupilos asignados.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}