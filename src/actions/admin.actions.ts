"use server";
import { adminService } from "@/services/admin.service";

export async function getUsersAction(page: number = 1, limit: number = 10) {
  return await adminService.getUsers(page, limit);
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  return await adminService.updateUserRole(userId, newRole);
}

export async function updateUserStatusAction(userId: string, newStatus: string) {
  return await adminService.updateUserStatus(userId, newStatus);
}
