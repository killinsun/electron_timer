import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Fab,
  IconButton,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CelebrationComponent from "./components/Celebration";
import { TimerDisplay } from "./components/TimerDisplay";
import { TimerSelect } from "./components/TimerSelect";
import Warning from "./components/Warning";
import { SettingsModal } from "./components/settingsModal";
import { useLessonDurations } from "./hooks/useLessonDurations";
import { useSettings } from "./hooks/useSettings";

export interface IElectronAPI {
  resizeWindow: (width: number, height: number, isBottomRight: boolean) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  uploadVideo: () => Promise<string | null>;
  getSavedVideo: () => Promise<File>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}

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

const App = () => {
  const { lessonDurations, updateLessonDurations } = useLessonDurations();
  const { settings, updateSettings } = useSettings();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isTimeRunningOut, setIsTimeRunningOut] = useState(false);

  const warningSeconds = settings.warningMinutes * 60;

  const startTimer = (minutes: number) => {
    const end = new Date(Date.now() + minutes * 60000);
    setEndTime(end);
    setRemainingTime(minutes * 60);
    setShowWarning(false);

    handleChangeWindowSize(400, 160, true);
  };

  const stopTimer = () => {
    setEndTime(null);
    setRemainingTime(0);
    setShowWarning(false);
    setShowEndMessage(false);
    setShowWelcomeMessage(false);
    setIsTimeRunningOut(false);
    setShowMessageInput(true);

    handleChangeWindowSize(900, 670, false);
  };

  const confirmToStopTimer = () => {
    if (window.confirm("タイマーを停止しますか？")) {
      stopTimer();
    }
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

  const handleChangeWindowSize = (
    width: number,
    height: number,
    isBottomRight: boolean,
  ) => {
    window.api.resizeWindow(width, height, isBottomRight);
  };

  // @ts-ignore
  useEffect(() => {
    if (endTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000);
        setRemainingTime(diff > 0 ? diff : 0);

        if (
          diff <= warningSeconds &&
          diff > 0 &&
          !isTimeRunningOut &&
          !showWarning
        ) {
          setIsTimeRunningOut(() => true);
          setShowWarning(() => true);
          window.api.setFullScreen(true);

          const newWarningTimer = setTimeout(() => {
            setShowWarning(false);
            window.api.setFullScreen(false);
          }, 10000);
          setWarningTimer(() => newWarningTimer);
        } else if (diff <= 0) {
          setShowEndMessage(() => true);
          setShowWarning(() => false);
          setIsTimeRunningOut(() => false);
          clearInterval(timer);
          window.api.setFullScreen(true);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [endTime, showWarning]);

  useEffect(() => {
    return () => {
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
    };
  }, [showWarning]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          overflow: "hidden",
        }}
      >
        {showSettingsModal && (
          <SettingsModal
            open={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            initialDurations={lessonDurations}
            onSaveDurations={updateLessonDurations}
            initialSettings={settings}
            onSaveSettings={updateSettings}
          />
        )}
        {endTime && (
          <Fab
            size="small"
            sx={{
              backgroundColor: "transparent",
              boxShadow: 0,
              position: "absolute",
              top: "0px",
              right: "0px",
              zIndex: 999,
            }}
            onClick={confirmToStopTimer}
          >
            <ClearIcon />
          </Fab>
        )}
        <Box
          sx={{
            display: "flex",
            margin: endTime ? "0" : "auto",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
              flexGrow: 1,
            }}
          >
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
            {!endTime && (
              <TimerSelect
                lessonDurations={lessonDurations}
                startTimer={startTimer}
                onClickSettings={() => setShowSettingsModal(true)}
              />
            )}
            {endTime && (
              <TimerDisplay
                isTimeRunningOut={isTimeRunningOut}
                remainingTime={remainingTime}
                endTime={endTime}
                changeWindowSize={handleChangeWindowSize}
              />
            )}
          </Box>
        </Box>
        {showWarning && (
          <Warning
            showWarning={showWarning}
            endTime={endTime}
            remainingTime={remainingTime}
          />
        )}
        {showEndMessage && (
          <CelebrationComponent
            showEndMessage={showEndMessage}
            onClickEnd={stopTimer}
          />
        )}
        <Slide
          direction="up"
          in={!endTime && showMessageInput}
          mountOnEnter
          unmountOnExit
        >
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
