"use client";

import { adminService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.")) return;

    setIsDeleting(true);
    const result = await adminService.deleteForumComment(commentId);
    setIsDeleting(false);

    if (result.success) {
      alert("Comentario eliminado");
      router.refresh();
    } else {
      alert("Error al eliminar el comentario: " + result.error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors ml-auto"
      title="Eliminar comentario"
    >
      <Trash2 className="w-3 h-3" />
    </button>
  );
}
