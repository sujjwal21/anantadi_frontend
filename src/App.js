import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, Button, Slider, Typography, Paper } from "@mui/material";

const App = () => {
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [cropStart, setCropStart] = useState(0);
  const [cropEnd, setCropEnd] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoRef.current.duration);
        setCropEnd(videoRef.current.duration);
      });
    }
  }, []);

  const handleTimeChange = (type, value) => {
    if (type === "start") {
      setCropStart(Math.min(value, cropEnd));
    } else {
      setCropEnd(Math.max(value, cropStart));
    }
  };

  const playCroppedSection = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = cropStart;
      videoRef.current.play();
      const stopPlayback = () => {
        if (videoRef.current.currentTime >= cropEnd) {
          videoRef.current.pause();
          videoRef.current.removeEventListener("timeupdate", stopPlayback);
        }
      };
      videoRef.current.addEventListener("timeupdate", stopPlayback);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Video Cropping Tool
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <video
              ref={videoRef}
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
              controls
              style={{ width: "100%", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            ></video>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Typography variant="body1">Start:</Typography>
              <Slider
                value={cropStart}
                min={0}
                max={videoDuration}
                step={0.01}
                onChange={(e, value) => handleTimeChange("start", value)}
                valueLabelDisplay="auto"
                sx={{ flex: 1 }}
              />

              <Typography variant="body1">End:</Typography>
              <Slider
                value={cropEnd}
                min={0}
                max={videoDuration}
                step={0.01}
                onChange={(e, value) => handleTimeChange("end", value)}
                valueLabelDisplay="auto"
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>

          <Paper elevation={3} sx={{ p: 3, maxWidth: "400px", width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Video Details
            </Typography>
            <Typography>Start Time: {cropStart.toFixed(2)}s</Typography>
            <Typography>End Time: {cropEnd.toFixed(2)}s</Typography>
            <Typography>Duration: {(cropEnd - cropStart).toFixed(2)}s</Typography>

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3 }}
              onClick={playCroppedSection}
            >
              Play Cropped Section
            </Button>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
