import { useState, useMemo } from "react";
import { Activity, Droplets, BookOpen, Dumbbell, Moon, Sun } from "lucide-react";
import type { CategoriaHabito } from "@/types/domain/habito.types";

export function useHabitForm(categorias: CategoriaHabito[]) {
  const [habitName, setHabitName] = useState("Caminar");
  const [descripcion, setDescripcion] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-[#A2AAFD]");
  const [frequency, setFrequency] = useState("Todos los dias");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categorias[0]?.idCategoria ?? "");
  const [selectedIcon, setSelectedIcon] = useState("activity");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["Manana"]);

  const icons = [
    { id: "activity", Cmp: Activity },
    { id: "droplets", Cmp: Droplets },
    { id: "book", Cmp: BookOpen },
    { id: "dumbbell", Cmp: Dumbbell },
    { id: "moon", Cmp: Moon },
    { id: "sun", Cmp: Sun },
  ];

  const colors = ["bg-[#A2AAFD]", "bg-[#FF99C2]", "bg-[#8D89FF]", "bg-[#FF6B80]", "bg-[#70F1C4]", "bg-[#FDE06F]"];

  const SelectedIconComponent = useMemo(
    () => icons.find((item) => item.id === selectedIcon)?.Cmp ?? Activity,
    [selectedIcon]
  );

  const selectedCategoriaLabel = useMemo(
    () => categorias.find((item) => item.idCategoria === selectedCategoryId)?.nombre ?? "Sin categoria",
    [categorias, selectedCategoryId]
  );

  const handleTimeToggle = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((item) => item !== time) : [...prev, time]
    );
  };

  const incrementTimes = () => setTimesPerDay((prev) => prev + 1);
  const decrementTimes = () => setTimesPerDay((prev) => Math.max(1, prev - 1));
  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);

  return {
    state: {
      habitName,
      descripcion,
      selectedColor,
      frequency,
      timesPerDay,
      notificationsEnabled,
      selectedCategoryId,
      selectedIcon,
      selectedTimes,
    },
    actions: {
      setHabitName,
      setDescripcion,
      setSelectedColor,
      setFrequency,
      setSelectedCategoryId,
      setSelectedIcon,
      handleTimeToggle,
      incrementTimes,
      decrementTimes,
      toggleNotifications,
    },
    computed: {
      icons,
      colors,
      SelectedIconComponent,
      selectedCategoriaLabel,
    },
  };
}
