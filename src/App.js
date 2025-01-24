import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const App = () => {
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [cropStart, setCropStart] = useState(0);
  const [cropEnd, setCropEnd] = useState(0);

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

  return (
    <div className="app-container">
      <div className="video-container">
        <video
          ref={videoRef}
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          controls
          width="600"
        ></video>
      </div>

      <div className="timeline-container">
        <div className="timeline">
          <input
            type="range"
            min="0"
            max={videoDuration}
            value={cropStart}
            step="0.01"
            onChange={(e) => handleTimeChange("start", parseFloat(e.target.value))}
          />
          <input
            type="range"
            min="0"
            max={videoDuration}
            value={cropEnd}
            step="0.01"
            onChange={(e) => handleTimeChange("end", parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="details-container">
        <h3>Video Details</h3>
        <p>Start Time: {cropStart.toFixed(2)}s</p>
        <p>End Time: {cropEnd.toFixed(2)}s</p>
        <p>Duration: {(cropEnd - cropStart).toFixed(2)}s</p>
        <button onClick={playCroppedSection}>Play Cropped Section</button>
      </div>
    </div>
  );
};

export default App;
