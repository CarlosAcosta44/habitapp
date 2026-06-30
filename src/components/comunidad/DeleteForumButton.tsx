"use client";

import { adminService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteForumButton({ forumId }: { forumId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("¿Estás seguro de que deseas eliminar este foro? Esta acción no se puede deshacer.")) return;

    setIsDeleting(true);
    const result = await adminService.deleteForum(forumId);
    setIsDeleting(false);

    if (result.success) {
      alert("Foro eliminado");
      router.refresh();
    } else {
      alert("Error al eliminar el foro: " + result.error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-4 left-4 z-10 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
      title="Eliminar foro"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
