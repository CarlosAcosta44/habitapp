/**
 * @file src/components/habitos/StreakBadge.tsx
 * @description Badge visual para mostrar la racha actual de un hábito.
 * Retorna null si la racha es 0 para no mostrar nada.
 */

interface StreakBadgeProps {
  streak: number;
  size?:  "sm" | "md" | "lg";
}

export function StreakBadge({ streak, size = "md" }: StreakBadgeProps) {
  if (streak === 0) return null;

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full
        bg-amber-100 dark:bg-amber-900
        text-amber-700 dark:text-amber-300
        font-semibold ${sizes[size]}
      `}
    >
      🔥 {streak} días seguidos
    </span>
  );
}