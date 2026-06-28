"use client";

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { adminService, UserProfile } from '@/services/admin.service';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI states for interactions
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminService.getUsers();
    
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error || "No se pudieron cargar los usuarios.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string, newRole: 'USER' | 'TRAINER' | 'ADMIN') => {
    if (currentRole === newRole) return;
    
    const confirmMessage = `¿Estás seguro de cambiar el rol a ${newRole}? Esta acción modificará los permisos del usuario de forma inmediata.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsUpdating(userId);
    const result = await adminService.updateUserRole(userId, newRole);
    
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast('success', `Rol actualizado a ${newRole} correctamente`);
    } else {
      showToast('error', result.error || 'Error al actualizar el rol');
    }
    setIsUpdating(null);
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 relative pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-rose-500 text-white'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{toastMessage.text}</p>
        </div>
      )}

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-indigo-500">
            <Link href="/admin" className="hover:underline">Panel Administrativo</Link>
            <span>/</span>
            <span>Gestión de Usuarios</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-500" />
            Usuarios Registrados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Administra los roles y permisos de todos los miembros de HabitApp.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Contenedor Principal (Glassmorphism) */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden relative">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
              <p className="font-medium animate-pulse">Cargando base de datos de usuarios...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error de Conexión</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">{error}</p>
              <button 
                onClick={fetchUsers}
                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="text-xs uppercase bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Usuario</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Puntos</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Registro</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Rol Actual</th>
                  <th scope="col" className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <p className="text-slate-500">No se encontraron usuarios coincidentes.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{user.full_name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-indigo-500">{user.total_points}</span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          user.role === 'ADMIN' 
                            ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                            : user.role === 'TRAINER'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                            : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={user.role}
                            disabled={isUpdating === user.id}
                            onChange={(e) => handleRoleChange(user.id, user.role, e.target.value as any)}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-1.5 outline-none cursor-pointer disabled:opacity-50 transition-all hover:border-indigo-400"
                          >
                            <option value="USER">Usuario</option>
                            <option value="TRAINER">Entrenador</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          
                          {isUpdating === user.id && (
                            <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
