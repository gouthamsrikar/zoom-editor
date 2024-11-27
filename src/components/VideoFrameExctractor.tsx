import React, { useRef, useState } from "react";

const VideoFrameExtractor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
    }
  };

  const drawFirstFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Ensure video is at the first frame
        video.currentTime = 0;

        video.oncanplay = () => {
          // Request animation frame to ensure the video is ready
          requestAnimationFrame(() => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
          });
        };
      }
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {videoURL && (
        <div>
          <video
            ref={videoRef}
            src={videoURL}
            onLoadedMetadata={drawFirstFrame} // Trigger once metadata is loaded
            style={{ display: "none" }} // Hide video element
          />
          <canvas ref={canvasRef} width="640" height="360" />
        </div>
      )}
    </div>
  );
};

export default VideoFrameExtractor;
