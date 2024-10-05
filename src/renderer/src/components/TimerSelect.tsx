import { Box, Button, TextField } from "@mui/material";
import { type FC, useState } from "react";
import type { LessonDuration } from "../hooks/useLessonDurations";

type Props = {
  startTimer: (minutes: number) => void;
  onClickSettings: () => void;
  lessonDurations: LessonDuration[];
};

export const TimerSelect: FC<Props> = (props) => {
  const { startTimer, onClickSettings, lessonDurations } = props;
  const [customTime, setCustomTime] = useState<number>(0);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="text" color="primary" onClick={onClickSettings}>
          設定
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {lessonDurations.map((duration) => (
          <Box key={duration.minutes} sx={{ display: "flex" }}>
            <Button
              variant="contained"
              onClick={() => startTimer(duration.minutes)}
              fullWidth
              sx={{
                padding: "16px",
                fontSize: "1.4rem",
                color: "white",
                backgroundColor: duration.color,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: duration.color,
                  filter: "brightness(80%)",
                },
              }}
            >
              {duration.label}
            </Button>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <TextField
          variant="outlined"
          type="number"
          value={customTime}
          fullWidth
          onChange={(e) => setCustomTime(Number(e.target.value))}
          size="small"
        />
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ minWidth: "200px" }}
          onClick={() => startTimer(customTime)}
        >
          カスタム
        </Button>
      </Box>
    </>
  );
};
