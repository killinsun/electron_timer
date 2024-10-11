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
  color: "blue" | "green" | "orange" | "red";
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
  value: LessonDuration["color"];
  label: string;
  hex: string;
}> = [
  { value: "blue", label: "青", hex: "#2196f3" },
  { value: "green", label: "緑", hex: "#4caf50" },
  { value: "orange", label: "オレンジ", hex: "#ff9800" },
  { value: "red", label: "赤", hex: "#f44336" },
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
        color: "blue",
      },
    ]);
  }, []);

  const handleRemoveDuration = useCallback((id: string) => {
    setDurations((prevDurations) => prevDurations.filter((d) => d.id !== id));
  }, []);

  const handleDurationChange = useCallback(
    (id: string, field: keyof LessonDuration, value: string | number) => {
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
                  label="ラベル"
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
                  value={duration.color}
                  onChange={(e) =>
                    handleDurationChange(
                      duration.id,
                      "color",
                      e.target.value as LessonDuration["color"],
                    )
                  }
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: colorOptions.find(
                            (c) => c.value === value,
                          )?.hex,
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
