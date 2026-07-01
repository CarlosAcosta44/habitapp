"use client";

import React, { useState, useEffect } from 'react';
import { getUsersAction, updateUserRoleAction } from '@/actions/admin.actions';
import type { UserProfileDto } from '@/types/domain/usuario.types';
import { Shield, ShieldAlert, User, Star } from 'lucide-react';

export function AdminUsersList() {
  const [users, setUsers] = useState<UserProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await getUsersAction();
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error || "Error al cargar la lista de usuarios.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChangeRole = async (userId: string, currentRoleName: string, newRoleName: string) => {
    if (currentRoleName === newRoleName) return;
    
    // Map to backend expected enum
    let roleEnum = 'usuario';
    if (newRoleName === 'Administrador') roleEnum = 'administrador';
    if (newRoleName === 'Entrenador') roleEnum = 'entrenador';

    if (!confirm(`¿Estás seguro de que quieres cambiar el rol a ${newRoleName}?`)) return;

    setChangingRole(userId);
    const result = await updateUserRoleAction(userId, roleEnum);
    
    if (result.success) {
      setUsers(prev => prev.map(u => 
        u.idusuario === userId ? { ...u, nombrerol: newRoleName } : u
      ));
    } else {
      alert(`Error al cambiar el rol: ${result.error}`);
    }
    setChangingRole(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 italic space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
        <p className="font-bold">Error al cargar datos</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={loadUsers}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl transition-all"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-4 px-4">Usuario</th>
            <th className="py-4 px-4">Puntos Totales</th>
            <th className="py-4 px-4">Rol Actual</th>
            <th className="py-4 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {users.map((u) => (
            <tr key={u.idusuario} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <td className="py-4 px-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  {u.fotoperfil ? (
                    <img src={u.fotoperfil} alt={u.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-500 dark:text-slate-400">{u.nombre?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{u.nombre} {u.apellido}</p>
                  <p className="text-xs text-slate-400">{u.idusuario}</p>
                </div>
              </td>
              <td className="py-4 px-4 font-medium text-indigo-500">
                {u.puntostotales} pts
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  u.nombrerol === 'Administrador' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                  u.nombrerol === 'Entrenador' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {u.nombrerol === 'Administrador' ? <ShieldAlert className="w-3.5 h-3.5" /> :
                   u.nombrerol === 'Entrenador' ? <Star className="w-3.5 h-3.5" /> :
                   <User className="w-3.5 h-3.5" />}
                  {u.nombrerol}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <select 
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                  value={u.nombrerol}
                  disabled={changingRole === u.idusuario}
                  onChange={(e) => handleChangeRole(u.idusuario, u.nombrerol, e.target.value)}
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Entrenador">Entrenador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
