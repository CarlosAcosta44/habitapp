"use client";

import React, { useState, useEffect } from 'react';
import {
  getUsersAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from '@/actions/admin.actions';
import type { UserProfileDto, PaginationMeta } from '@/domain/usuario.types';
import {
  ShieldAlert,
  User,
  Star,
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle2,
} from 'lucide-react';

export function AdminUsersList() {
  const [users, setUsers] = useState<UserProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const loadUsers = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    const result = await getUsersAction(targetPage, 10);
    if (result.success) {
      setUsers(result.data.data);
      setPagination(result.data.meta);
      setPage(targetPage);
    } else {
      setError(result.error || "Error al cargar la lista de usuarios.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadUsers(1);
  }, []);

  const handleChangeRole = async (userId: string, currentRoleName: string, newRoleName: string) => {
    if (currentRoleName === newRoleName) return;
    
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

  const handleToggleStatus = async (userId: string, currentStatus?: string) => {
    const isCurrentlySuspended = currentStatus === 'Suspendido';
    const newStatus = isCurrentlySuspended ? 'Activo' : 'Suspendido';
    const actionLabel = isCurrentlySuspended ? 'reactivar' : 'suspender';

    if (!confirm(`¿Estás seguro de que deseas ${actionLabel} la cuenta de este usuario?`)) return;

    setChangingStatus(userId);
    const result = await updateUserStatusAction(userId, newStatus);

    if (result.success) {
      setUsers(prev => prev.map(u =>
        u.idusuario === userId ? { ...u, estado_cuenta: newStatus } : u
      ));
    } else {
      alert(`Error al cambiar el estado: ${result.error}`);
    }
    setChangingStatus(null);
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
          type="button"
          onClick={() => void loadUsers(page)}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl transition-all"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/40">
              <th className="py-4 px-4">Usuario</th>
              <th className="py-4 px-4">Puntos</th>
              <th className="py-4 px-4">Rol</th>
              <th className="py-4 px-4">Estado</th>
              <th className="py-4 px-4 text-right">Gestión de Cuenta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
            {users.map((u) => {
              const status = u.estado_cuenta || 'Activo';
              const isSuspended = status === 'Suspendido';

              return (
                <tr key={u.idusuario} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
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

                  <td className="py-4 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                    {u.puntostotales} pts
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.nombrerol === 'Administrador' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                      u.nombrerol === 'Entrenador' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {u.nombrerol === 'Administrador' ? <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> :
                       u.nombrerol === 'Entrenador' ? <Star className="w-3.5 h-3.5" aria-hidden="true" /> :
                       <User className="w-3.5 h-3.5" aria-hidden="true" />}
                      {u.nombrerol}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isSuspended
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}>
                      {isSuspended ? (
                        <Ban className="w-3 h-3" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      )}
                      {status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select 
                        aria-label={`Cambiar rol de ${u.nombre}`}
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-1.5"
                        value={u.nombrerol}
                        disabled={changingRole === u.idusuario}
                        onChange={(e) => handleChangeRole(u.idusuario, u.nombrerol, e.target.value)}
                      >
                        <option value="Usuario">Usuario</option>
                        <option value="Entrenador">Entrenador</option>
                        <option value="Administrador">Administrador</option>
                      </select>

                      <button
                        type="button"
                        disabled={changingStatus === u.idusuario}
                        onClick={() => void handleToggleStatus(u.idusuario, u.estado_cuenta)}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          isSuspended
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {isSuspended ? 'Reactivar' : 'Suspender'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-2 py-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Página <span className="font-bold text-slate-700 dark:text-slate-200">{pagination.page}</span> de{' '}
          <span className="font-bold text-slate-700 dark:text-slate-200">{pagination.totalPages}</span>{' '}
          ({pagination.total} usuarios en total)
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1 || loading}
            onClick={() => void loadUsers(pagination.page - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => void loadUsers(pagination.page + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
