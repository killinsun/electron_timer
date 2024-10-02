import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  TextField,
  Paper,
  Fab,
  Slide,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CelebrationComponent from "./components/Celebration";
import Warning from "./components/Warning";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const lessonDurations = [
  { label: "xコマ (0.5分)", minutes: 0.5, color: "primary" },
  { label: "1コマ (50分)", minutes: 50, color: "primary" },
  { label: "2コマ (100分)", minutes: 100, color: "secondary" },
  { label: "3コマ (150分)", minutes: 150, color: "success" },
  { label: "4コマ (200分)", minutes: 200, color: "warning" },
];

const App = () => {
  const [customTime, setCustomTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  const startTimer = (minutes: number) => {
    const end = new Date(Date.now() + minutes * 60000);
    setEndTime(end);
    setRemainingTime(minutes * 60);
    setShowWarning(false);
  };

  const handleConfirmMessage = () => {
    if (welcomeMessage.trim() !== "") {
      setShowWelcomeMessage(true);
      setShowMessageInput(false);
    }
  };

  const handleEditMessage = () => {
    setShowMessageInput(true);
    setShowWelcomeMessage(false);
  };

  // @ts-ignore
  useEffect(() => {
    if (endTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000);
        setRemainingTime(diff > 0 ? diff : 0);

        if (diff <= 300 && diff > 0 && !showWarning) {
          setShowWarning(true);
        } else if (diff <= 0) {
          setShowEndMessage(true);
          setShowWarning(false);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [endTime, showWarning]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "background.default",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", margin: "auto", flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flexGrow: 1,
            }}
          >
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
            {showWelcomeMessage && (
              <Paper
                elevation={0}
                sx={{
                  padding: "24px",
                  bgcolor: "info.light",
                  color: "info.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">{welcomeMessage}</Typography>
                <IconButton onClick={handleEditMessage} size="small">
                  <EditIcon />
                </IconButton>
              </Paper>
            )}
            {endTime && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "32px",
                  gap: "8px",
                  flexGrow: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2rem",
                  }}
                >
                  終了時刻: {endTime.toLocaleTimeString()}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontSize: "3rem" }}
                >
                  残り時間: {Math.floor(remainingTime / 60)}分{" "}
                  {remainingTime % 60}秒
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Warning
          showWarning={showWarning}
          endTime={endTime}
          remainingTime={remainingTime}
        />
        <CelebrationComponent showEndMessage={showEndMessage} />
        <Slide direction="up" in={showMessageInput} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "background.paper",
              p: 2,
              boxShadow: 3,
            }}
          >
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                label="一言メッセージ"
                variant="outlined"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
              />
              <Fab color="primary" onClick={handleConfirmMessage}>
                <CheckIcon />
              </Fab>
            </Box>
          </Box>
        </Slide>
      </Box>
    </ThemeProvider>
  );
};

export default App;
