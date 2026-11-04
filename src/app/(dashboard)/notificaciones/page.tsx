import { redirect } from 'next/navigation';

/**
 * La página completa de notificaciones fue reemplazada por un Modal interactivo accesible
 * desde cualquier pantalla a través de la campanita en el Header o Sidebar.
 * Cualquier acceso directo a esta ruta redirige limpiamente al dashboard de hábitos.
 */
export default function NotificacionesRedirectPage() {
  redirect('/habitos');
}
