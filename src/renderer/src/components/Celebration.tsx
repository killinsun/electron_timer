import { Box, Button, Fade, Typography } from "@mui/material";
import type { FC } from "react";
import { useSettings } from "../hooks/useSettings";

type Props = {
  showEndMessage: boolean;
  onClickEnd: () => void;
};
const CelebrationComponent: FC<Props> = (props) => {
  const { showEndMessage, onClickEnd } = props;
  const { settings } = useSettings();

  return (
    <Fade in={showEndMessage}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {settings.finishVideoPath && (
            <video
              src={`safe-file://${settings.finishVideoPath}`}
              controls
              autoPlay={true}
              muted={true}
              height={600}
            />
          )}
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              color: "primary.main",
              animation: "bounceIn 1s",
            }}
          >
            本日も学習お疲れさまでした！
            <br />
            <Typography
              variant="h3"
              component="span"
              sx={{ color: "secondary.main" }}
            >
              お時間ある方はレッスン追加可能です！最大50％割引あります
            </Typography>
          </Typography>
          <Button onClick={onClickEnd} variant="contained" color="primary">
            終了
          </Button>

          {!settings.finishVideoPath && (
            <>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                }}
              >
                {[...Array(50)].map((_, i) => (
                  <Box
                    key={`${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      i
                    }_item`}
                    sx={{
                      position: "absolute",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      bgcolor: (theme) => theme.palette.secondary.main,
                      animation: `confetti 3s ease-in-out ${Math.random() * 3}s infinite`,
                      left: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                ))}
              </Box>
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  bgcolor: "warning.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 1s infinite",
                  fontSize: "60px",
                }}
              >
                😄
              </Box>
              <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.1); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(1000%) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
            </>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default CelebrationComponent;
