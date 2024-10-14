import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import type React from "react";
import { useCallback, useState } from "react";
import type { Settings } from "../hooks/useSettings";

type LessonDuration = {
  id: string;
  label: string;
  minutes: number;
  hex: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialDurations: LessonDuration[];
  initialSettings: Settings;
  onSaveDurations: (durations: LessonDuration[]) => void;
  onSaveSettings: (settings: Settings) => void;
};

const colorOptions: Array<{
  value: LessonDuration["hex"];
  label: string;
  hex: string;
}> = [
  { value: "#2196f3", label: "青", hex: "#2196f3" },
  { value: "#4caf50", label: "緑", hex: "#4caf50" },
  { value: "#f44336", label: "赤", hex: "#f44336" },
  { value: "#9c27b0", label: "紫", hex: "#9c27b0" },
  { value: "#ff9800", label: "オレンジ", hex: "#ff9800" },
  { value: "#009688", label: "ティール", hex: "#009688" },
  { value: "#3f51b5", label: "インディゴ", hex: "#3f51b5" },
  { value: "#ffeb3b", label: "黄", hex: "#ffeb3b" },
  { value: "#795548", label: "茶", hex: "#795548" },
  { value: "#e91e63", label: "ピンク", hex: "#e91e63" },
  { value: "#00bcd4", label: "シアン", hex: "#00bcd4" },
  { value: "#ff5722", label: "ディープオレンジ", hex: "#ff5722" },
  { value: "#8bc34a", label: "ライトグリーン", hex: "#8bc34a" },
  { value: "#ffc107", label: "アンバー", hex: "#ffc107" },
  { value: "#607d8b", label: "ブルーグレー", hex: "#607d8b" },
];

export const SettingsModal: React.FC<Props> = ({
  open,
  onClose,
  initialDurations,
  initialSettings,
  onSaveDurations,
  onSaveSettings,
}) => {
  const [tab, setTab] = useState(0);
  const [durations, setDurations] = useState<LessonDuration[]>(() =>
    initialDurations.map((d) => ({
      ...d,
      id: Math.random().toString(36).substr(2, 9),
    })),
  );
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const handleAddDuration = useCallback(() => {
    setDurations((prevDurations) => [
      ...prevDurations,
      {
        id: Math.random().toString(36).substr(2, 9),
        label: "",
        minutes: 0,
        hex: "#2196f3",
      },
    ]);
  }, []);

  const handleRemoveDuration = useCallback((id: string) => {
    setDurations((prevDurations) => prevDurations.filter((d) => d.id !== id));
  }, []);

  const handleDurationChange = useCallback(
    (id: string, field: keyof LessonDuration, value: string | number) => {
      console.log({ id, field, value });
      setDurations((prevDurations) =>
        prevDurations.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
      );
    },
    [],
  );

  const handleSettingsChange = useCallback(
    (field: keyof Settings, value: string | number) => {
      if (field === "warningMinutes") {
        setSettings((prevSettings) => ({
          ...prevSettings,
          [field]: Number(value),
        }));
      }
    },
    [],
  );

  const handleFileOpen = async (target: "warning" | "finish") => {
    const filePath = await window.api.uploadVideo();
    // file:// -> safe-file://
    if (!filePath) {
      return;
    }

    const safeFilePath = filePath.replace("file://", "safe-file://");

    setSettings((prevSettings) => ({
      ...prevSettings,
      finishVideoPath:
        target === "finish" ? safeFilePath : prevSettings.finishVideoPath,
      warningVideoPath:
        target === "warning" ? safeFilePath : prevSettings.warningVideoPath,
    }));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSave = useCallback(() => {
    onSaveDurations(durations);
    onSaveSettings(settings);
    onClose();
  }, [durations, settings, onSaveDurations, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>設定</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="授業時間" />
          <Tab label="その他" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
            {durations.map((duration) => (
              <Box
                key={duration.id}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <TextField
                  type="text"
                  value={duration.label}
                  onChange={(e) =>
                    handleDurationChange(duration.id, "label", e.target.value)
                  }
                />
                <TextField
                  label="分"
                  type="number"
                  value={duration.minutes}
                  onChange={(e) =>
                    handleDurationChange(
                      duration.id,
                      "minutes",
                      Number(e.target.value),
                    )
                  }
                />
                <Select
                  sx={{ width: "300px" }}
                  value={duration.hex}
                  onChange={(e) =>
                    handleDurationChange(duration.id, "hex", e.target.value)
                  }
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: value,
                        }}
                      />
                      {colorOptions.find((c) => c.value === value)?.label}
                    </Box>
                  )}
                >
                  {colorOptions.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: color.hex,
                          }}
                        />
                        {color.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <IconButton onClick={() => handleRemoveDuration(duration.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddDuration}>
              授業時間を追加
            </Button>
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
            <TextField
              label="何分前に警告を表示するか"
              type="number"
              value={settings.warningMinutes}
              onChange={(e) =>
                handleSettingsChange("warningMinutes", Number(e.target.value))
              }
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">
                  終了 {settings?.warningMinutes} 分前に再生する動画
                </Typography>
                <Typography variant="caption">
                  {settings?.warningVideoPath}
                </Typography>
              </Box>
              <Button onClick={() => handleFileOpen("warning")}>
                動画ファイルを選択
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">終了時に再生する動画</Typography>
                <Typography variant="caption">
                  {settings?.finishVideoPath}
                </Typography>
              </Box>
              <Button onClick={() => handleFileOpen("finish")}>
                動画ファイルを選択
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleSave}>
          保存して閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};
