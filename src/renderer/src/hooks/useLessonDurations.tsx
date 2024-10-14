import { useCallback, useEffect, useState } from "react";

export type LessonDuration = {
  id: string;
  label: string;
  minutes: number;
  hex: string;
};

const DEFAULT_DURATIONS: LessonDuration[] = [
  { id: "duration1", label: "1コマ (50分)", minutes: 50, hex: "blue" },
  { id: "duration2", label: "2コマ (100分)", minutes: 100, hex: "green" },
  { id: "duration3", label: "3コマ (150分)", minutes: 150, hex: "orange" },
  { id: "duration4", label: "4コマ (200分)", minutes: 200, hex: "red" },
];

const STORAGE_KEY = "lessonDurations";

export const useLessonDurations = () => {
  const [lessonDurations, setLessonDurations] = useState<LessonDuration[]>(
    () => {
      const storedDurations = localStorage.getItem(STORAGE_KEY);
      return storedDurations ? JSON.parse(storedDurations) : DEFAULT_DURATIONS;
    },
  );

  useEffect(() => {
    console.log(lessonDurations);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessonDurations));
  }, [lessonDurations]);

  const updateLessonDurations = useCallback(
    (newDurations: LessonDuration[]) => {
      setLessonDurations(() => newDurations);
    },
    [],
  );

  const resetToDefaults = useCallback(() => {
    setLessonDurations(DEFAULT_DURATIONS);
  }, []);

  return {
    lessonDurations,
    updateLessonDurations,
    resetToDefaults,
  };
};
