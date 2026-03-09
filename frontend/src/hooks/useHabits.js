/**
 * useHabits.js
 * Custom Hook: centraliza el estado y la lógica de los hábitos.
 * Patrón Observer: useState y useEffect para reactividad.
 * Patrón Repository: abstrae el acceso a datos.
 */
import { useState, useEffect } from 'react';
import { habits, getImageUrl, getVideoUrl, getPdfUrl } from '../services/habitsService';

export const useHabits = () => {
  const [habitList, setHabitList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.resolve(habits).then((data) => {
      setHabitList(data);
      setLoading(false);
    });
  }, []);

  const toggleLike = (name) =>
    setLiked((prev) => ({ ...prev, [name]: !prev[name] }));

  const selectHabit = (habit) => setSelected(habit);
  const closeHabit = () => setSelected(null);

  const registerError = (name) =>
    setErrors((prev) => ({ ...prev, [name]: true }));

  const likedCount = Object.values(liked).filter(Boolean).length;

  return {
    habitList,
    loading,
    liked,
    errors,
    selected,
    likedCount,
    toggleLike,
    selectHabit,
    closeHabit,
    registerError,
    getImageUrl,
    getVideoUrl,
    getPdfUrl,
  };
};