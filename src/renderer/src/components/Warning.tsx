import { Box, Fade, Typography } from "@mui/material";
import type { FC } from "react";

type Props = {
  showWarning: boolean;
  endTime: Date | null;
  remainingTime: number;
};
const Warning: FC<Props> = (props) => {
  const { showWarning, endTime, remainingTime } = props;

  return (
    <Fade in={showWarning}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(255, 200, 0, 0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 300,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            animation: "pulse 2s infinite",
            textAlign: "center",
          }}
        >
          まもなく終了です
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          保存などを行い終了の準備をしましょう♪
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          レッスンに関してご質問がある方は
          <br />
          時間内にお願いします
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          終了時刻: {endTime?.toLocaleTimeString()}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          残り時間: {Math.floor(remainingTime / 60)}分 {remainingTime % 60}秒
        </Typography>
      </Box>
    </Fade>
  );
};

export default Warning;
