import { HabitoService } from "@/services/habito.service";
import { HabitCreatorPremiumForm } from "@/components/habitos/HabitCreatorPremiumForm";
import type { CategoriaHabito } from "@/types/domain/habito.types";

export const metadata = { title: "Crear Hábito | HabitApp" };

// Categorías base del sistema (coinciden con los datos iniciales de la BD)
// Se usan como fallback si la consulta a Supabase falla o devuelve vacío.
const CATEGORIAS_FALLBACK: CategoriaHabito[] = [
  { idCategoria: "cat-ejercicio",    nombre: "Ejercicio",     descripcion: "Actividades físicas y deportivas" },
  { idCategoria: "cat-nutricion",    nombre: "Nutrición",     descripcion: "Hábitos alimenticios saludables" },
  { idCategoria: "cat-sueno",        nombre: "Sueño",         descripcion: "Rutinas y calidad del sueño" },
  { idCategoria: "cat-hidratacion",  nombre: "Hidratación",   descripcion: "Consumo adecuado de agua" },
  { idCategoria: "cat-salud-mental", nombre: "Salud Mental",  descripcion: "Meditación, mindfulness y bienestar emocional" },
  { idCategoria: "cat-productividad",nombre: "Productividad", descripcion: "Organización y gestión del tiempo" },
];

const habitoService = new HabitoService();

export default async function CrearHabitoPage() {
  const categoriasResult = await habitoService.getCategorias();

  // Si la query falla, loguea el error en server console para depuración
  if (!categoriasResult.success) {
    console.error("[CrearHabitoPage] Error al cargar categorías:", categoriasResult.error);
  }

  // Usa las categorías de la BD; si están vacías, usa el fallback
  const categoriasDB = categoriasResult.success ? categoriasResult.data : [];
  const categorias = categoriasDB.length > 0 ? categoriasDB : CATEGORIAS_FALLBACK;

  return <HabitCreatorPremiumForm categorias={categorias} />;
}
