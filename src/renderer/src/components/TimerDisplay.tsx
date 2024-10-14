import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useSettings } from "../hooks/useSettings";
import AnalogClock from "./AnalogClock";

type Props = {
  isTimeRunningOut: boolean;
  remainingTime: number;
  endTime: Date;
  changeWindowSize: (
    width: number,
    height: number,
    isBottomRight: boolean,
  ) => void;
};

export const TimerDisplay: FC<Props> = (props) => {
  const { isTimeRunningOut, remainingTime, endTime } = props;
  const { settings } = useSettings();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexGrow: 1,
        maxHeight: "105px",
      }}
    >
      <AnalogClock />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.2rem",
          }}
        >
          終了時刻: {endTime.toLocaleTimeString()}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: isTimeRunningOut ? "red" : "black",
          }}
        >
          残り時間: {Math.floor(remainingTime / 60)}分 {remainingTime % 60}秒
        </Typography>
        {isTimeRunningOut && (
          <Typography variant={"h6"} sx={{ fontSize: "1rem" }}>
            {settings.warningMinutes}
            分前です。そろそろ保存をして片付けの準備をしましょう
          </Typography>
        )}
      </Box>
    </Box>
  );
};
