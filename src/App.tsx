import React, { useRef, useState } from 'react';
import EditorPage from './pages/EditorPage';
import FilledButton from './widgets/FilledButton';

function App() {

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video")); // In-memory video element
  const [videoLength, setVideoLength] = useState<number | null>(null);


  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const video = videoRef.current;
      video.src = url;
      video.load();
      video.onloadedmetadata = () => {
        setVideoLength(video.duration)
        setVideoSrc(url);
      };

    }
  };

  return (
    <div className="text-white mac-like-bg h-screen w-screen flex flex-col justify-center items-center font-metropolis">{
      videoSrc && videoLength ?
        <EditorPage videoSrc={videoSrc}
          videoLength={videoLength}
        />
        :
        <div>
          <label
            htmlFor="video-upload"
            className="cursor-pointer px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out 
          ring-2 ring-blue-300 hover:ring-blue-400 focus:ring-blue-500
          glow-button"
          >
            Upload Video
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </div>

    }
    </div>
  );
}

export default App;
