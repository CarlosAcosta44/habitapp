/**
 * Hábitos sugeridos en el paso 2 del registro (alineados al diseño).
 * `categoria` debe coincidir con el nombre en seguimiento.categorias_habitos (script SQL).
 */
export const ONBOARDING_HABIT_PRESETS = [
  {
    id: 'beber_agua',
    label: 'Beber agua',
    emoji: '💧',
    nombre: 'Beber agua',
    categoria: 'Hidratación',
    puntos: 5,
  },
  {
    id: 'correr',
    label: 'Correr',
    emoji: '🏃',
    nombre: 'Correr',
    categoria: 'Ejercicio',
    puntos: 15,
  },
  {
    id: 'leer',
    label: 'Leer libros',
    emoji: '📖',
    nombre: 'Leer libros',
    categoria: 'Productividad',
    puntos: 10,
  },
  {
    id: 'meditar',
    label: 'Meditar',
    emoji: '🧘',
    nombre: 'Meditar',
    categoria: 'Salud Mental',
    puntos: 10,
  },
  {
    id: 'estudiar',
    label: 'Estudiar',
    emoji: '🎓',
    nombre: 'Estudiar',
    categoria: 'Productividad',
    puntos: 10,
  },
  {
    id: 'dormir',
    label: 'Dormir',
    emoji: '🌙',
    nombre: 'Dormir bien',
    categoria: 'Sueño',
    puntos: 10,
  },
] as const

export type OnboardingHabitPresetId = (typeof ONBOARDING_HABIT_PRESETS)[number]['id']

export const ONBOARDING_PRESET_IDS = new Set<string>(
  ONBOARDING_HABIT_PRESETS.map((p) => p.id)
)
