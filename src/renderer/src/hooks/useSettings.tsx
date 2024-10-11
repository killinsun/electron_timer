import { useCallback, useEffect, useState } from "react";

export type Settings = {
  warningMinutes: number; // 何分前に警告を出すか
  warningVideoPath: string | null; // 警告時に再生する動画のパス
  finishVideoPath: string | null; // 終了時に再生する動画のパス
};

const defaultSettings = {
  warningMinutes: 5,
  warningVideoPath: null,
  finishVideoPath: null,
};

const STORAGE_KEY = "settings";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(() => newSettings);
  }, []);

  return {
    settings,
    updateSettings,
  };
};
