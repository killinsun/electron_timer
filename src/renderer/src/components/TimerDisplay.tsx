import { Box, Typography } from "@mui/material";
import { type FC, useState } from "react";
import AnalogClock from "./AnalogClock";

type Props = {
  remainingTime: number;
  endTime: Date;
  changeWindowSize: (
    width: number,
    height: number,
    isBottomRight: boolean,
  ) => void;
};

export const TimerDisplay: FC<Props> = (props) => {
  const { remainingTime, endTime, changeWindowSize } = props;
  const [showAnalog, setShowAnalog] = useState(false);

  const toggleDisplayMode = () => {
    setShowAnalog((prev) => !prev);

    if (showAnalog) {
      changeWindowSize(400, 145, true);
    } else {
      changeWindowSize(250, 225, true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingX: "32px",
        gap: "8px",
        flexGrow: 1,
      }}
      onDoubleClick={toggleDisplayMode}
    >
      {showAnalog ? (
        <AnalogClock />
      ) : (
        <>
          <Typography
            sx={{
              fontSize: "1.5rem",
            }}
          >
            終了時刻: {endTime.toLocaleTimeString()}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "2rem" }}>
            残り時間: {Math.floor(remainingTime / 60)}分 {remainingTime % 60}秒
          </Typography>
        </>
      )}
    </Box>
  );
};
