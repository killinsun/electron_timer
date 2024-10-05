import { Box, Button, TextField } from "@mui/material";
import { type FC, useState } from "react";

const lessonDurations = [
  { label: "1コマ (50分)", minutes: 50, color: "primary" },
  { label: "2コマ (100分)", minutes: 100, color: "secondary" },
  { label: "3コマ (150分)", minutes: 150, color: "success" },
  { label: "4コマ (200分)", minutes: 200, color: "warning" },
];

type Props = {
  startTimer: (minutes: number) => void;
};

export const TimerSelect: FC<Props> = (props) => {
  const { startTimer } = props;
  const [customTime, setCustomTime] = useState<number>(0);

  return (
    <>
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
              color={
                duration.color as
                  | "primary"
                  | "secondary"
                  | "success"
                  | "warning"
              }
              onClick={() => startTimer(duration.minutes)}
              fullWidth
              sx={{ padding: "16px", fontSize: "1.4rem" }}
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
