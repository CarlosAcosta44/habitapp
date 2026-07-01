"use client";

import { useState } from "react";
import { Users, BookOpen, Activity, Plus, Edit, Trash2, CheckCircle, X } from "lucide-react";
import { 
  createRoutineAction, 
  updateRoutineAction, 
  deleteRoutineAction, 
  assignRoutineToClientAction,
  getCoachClientProgressAction
} from "@/actions/coach.actions";

export function CoachDashboardClient({ initialClients, initialRoutines }: { initialClients: any[], initialRoutines: any[] }) {
  const [activeTab, setActiveTab] = useState<"clients" | "routines">("clients");
  const [routines, setRoutines] = useState(initialRoutines);
  
  // Modals state
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [routineForm, setRoutineForm] = useState({ name: "", description: "" });
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedRoutineToAssign, setSelectedRoutineToAssign] = useState<string>("");
  
  const [progressModal, setProgressModal] = useState<{isOpen: boolean, client: any, data: any}>({
    isOpen: false,
    client: null,
    data: null
  });

  const handleSaveRoutine = async () => {
    if (!routineForm.name) return;
    
    if (editingRoutine) {
      const res = await updateRoutineAction(editingRoutine.id, routineForm);
      if (res.success) {
        setRoutines(routines.map(r => r.id === editingRoutine.id ? res.data : r));
      } else {
        alert("Error al actualizar la rutina");
      }
    } else {
      const res = await createRoutineAction(routineForm);
      if (res.success) {
        setRoutines([res.data, ...routines]);
      } else {
        alert("Error al crear la rutina");
      }
    }
    
    setIsRoutineModalOpen(false);
    setEditingRoutine(null);
    setRoutineForm({ name: "", description: "" });
  };

  const handleDeleteRoutine = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta rutina?")) return;
    const res = await deleteRoutineAction(id);
    if (res.success) {
      setRoutines(routines.filter(r => r.id !== id));
    } else {
      alert("Error al eliminar la rutina");
    }
  };

  const handleAssignRoutine = async () => {
    if (!selectedClient || !selectedRoutineToAssign) return;
    const res = await assignRoutineToClientAction(selectedClient.idusuario, selectedRoutineToAssign);
    if (res.success) {
      alert("Rutina asignada exitosamente");
      setIsAssignModalOpen(false);
    } else {
      alert("Error al asignar la rutina");
    }
  };

  const handleViewProgress = async (client: any) => {
    const res = await getCoachClientProgressAction(client.idusuario);
    if (res.success) {
      setProgressModal({ isOpen: true, client, data: res.data });
    } else {
      alert("Error al cargar progreso: " + res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab("clients")}
          className={`pb-2 px-4 font-semibold text-sm transition-colors ${activeTab === "clients" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
        >
          Mis Clientes
        </button>
        <button 
          onClick={() => setActiveTab("routines")}
          className={`pb-2 px-4 font-semibold text-sm transition-colors ${activeTab === "routines" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
        >
          Gestión de Rutinas
        </button>
      </div>

      {/* Tab: Clientes */}
      {activeTab === "clients" && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
          {initialClients.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tienes clientes aún</h2>
              <p className="text-slate-500 max-w-sm mx-auto">Comparte tu enlace de entrenador para que los usuarios se unan a tu equipo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialClients.map((c: any) => (
                <div key={c.client.idusuario} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={c.client.fotoperfil || `https://ui-avatars.com/api/?name=${c.client.nombre}+${c.client.apellido}&background=random`} alt="avatar" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{c.client.nombre} {c.client.apellido}</p>
                      <p className="text-xs text-slate-500">Asignado: {new Date(c.assigned_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewProgress(c.client)}
                      className="flex-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Ver Progreso
                    </button>
                    <button 
                      onClick={() => { setSelectedClient(c.client); setIsAssignModalOpen(true); }}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Asignar Rutina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Rutinas */}
      {activeTab === "routines" && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tus Rutinas Maestras</h2>
            <button 
              onClick={() => { setEditingRoutine(null); setRoutineForm({ name: "", description: "" }); setIsRoutineModalOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Crear Rutina
            </button>
          </div>
          
          {routines.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No tienes rutinas creadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {routines.map((r: any) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{r.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{r.description || 'Sin descripción'}</p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => { setEditingRoutine(r); setRoutineForm({ name: r.name, description: r.description }); setIsRoutineModalOpen(true); }}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRoutine(r.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Crear/Editar Rutina */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
              {editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Nombre</label>
                <input 
                  type="text" 
                  value={routineForm.name}
                  onChange={(e) => setRoutineForm({...routineForm, name: e.target.value})}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2"
                  placeholder="Ej: Rutina de Mañana"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Descripción</label>
                <textarea 
                  value={routineForm.description}
                  onChange={(e) => setRoutineForm({...routineForm, description: e.target.value})}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 h-24"
                  placeholder="Detalles de la rutina..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsRoutineModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancelar
              </button>
              <button onClick={handleSaveRoutine} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Asignar Rutina */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Asignar Rutina a {selectedClient?.nombre}
            </h3>
            <p className="text-sm text-slate-500 mb-4">Selecciona una de tus rutinas maestras para clonarla al cliente.</p>
            <div className="space-y-4">
              <select 
                value={selectedRoutineToAssign}
                onChange={(e) => setSelectedRoutineToAssign(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3"
              >
                <option value="">-- Seleccionar Rutina --</option>
                {routines.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancelar
              </button>
              <button onClick={handleAssignRoutine} disabled={!selectedRoutineToAssign} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50">
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Progreso del Cliente */}
      {progressModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Progreso de {progressModal.client?.nombre}
              </h3>
              <button onClick={() => setProgressModal({...progressModal, isOpen: false})} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-4">
              {(!progressModal.data || progressModal.data.length === 0) ? (
                <p className="text-slate-500 text-center py-8">No hay hábitos registrados para este cliente.</p>
              ) : (
                progressModal.data.map((habit: any) => (
                  <div key={habit.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{habit.name}</p>
                        <p className="text-xs text-slate-500">{habit.description || 'Sin descripción'} • {habit.frequency}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Últimos Registros:</p>
                      <div className="flex flex-wrap gap-2">
                        {habit.habit_records && habit.habit_records.length > 0 ? (
                          habit.habit_records.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> {new Date(r.completed_date).toLocaleDateString()}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">Sin completar aún</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
