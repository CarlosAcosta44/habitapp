"use server";
import { adminService } from "@/services/admin.service";

export async function getUsersAction() {
  return await adminService.getUsers();
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  return await adminService.updateUserRole(userId, newRole);
}
