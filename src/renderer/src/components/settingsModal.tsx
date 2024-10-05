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
  TextField,
} from "@mui/material";
import type React from "react";
import { useState, useCallback } from "react";

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
  onSave: (durations: LessonDuration[]) => void;
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
  onSave,
}) => {
  const [durations, setDurations] = useState<LessonDuration[]>(() =>
    initialDurations.map((d) => ({
      ...d,
      id: Math.random().toString(36).substr(2, 9),
    })),
  );

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

  const handleSave = useCallback(() => {
    onSave(durations);
    onClose();
  }, [durations, onSave, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>授業時間設定</DialogTitle>
      <DialogContent>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleSave}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};
