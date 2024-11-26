import React, { useRef, useState } from 'react'

const VideoEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);

    const videoRef = useRef<HTMLVideoElement>(document.createElement("video")); // In-memory video element
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [frameRate, setFrameRate] = useState<number>(30);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const ranges: [number, number, number, number, number][] = [[5, 10, 500, 500, 2], [15, 20, 3000, 3000, 3], [25, 30, 500, 2000, 2], [30, 35, 2000, 500, 3]];

    function isInRange(value: number, ranges: [number, number, number, number, number][]): [number, number, number, number, number] {
        for (const [start, end, zoomX, zoomY, scale] of ranges) {
            if (value >= start && value <= end) {
                return [start, end, zoomX, zoomY, scale];
            }
        }
        return [-100, -100, 2000, 2000, 1];
    }

    const setCanvas = (value: number) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvas2 = canvasRef2.current;
        video.currentTime = 0.0;
        console.log("1");
        if (video && canvas && canvas2) {
            console.log("2");
            const ctx = canvas.getContext("2d");
            const ctx2 = canvas.getContext("2d");
            if (ctx && ctx2) {
                console.log("3");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas2.width = video.videoWidth;
                canvas2.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                ctx2.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
    }

    const play = (currentTimeInMilliSeconds: number) => {
        const interval = frameRate;
        const endTime = duration * 1000;

        const timer = setInterval(() => {
            setTimeElapsed((prev) => {

                if (currentTimeInMilliSeconds + prev >= endTime) {
                    clearInterval(timer);

                    console.log("Timer finished!");
                    return prev + currentTimeInMilliSeconds;
                }
                console.log((currentTimeInMilliSeconds + prev + interval) / 1000);
                handleTimeUpdateTime((currentTimeInMilliSeconds + prev + interval) / 1000)

                return prev + interval;
            });
        }, interval);
    }

    const handleTimeUpdateTime = (value: number) => {
        const time = value;
        const video = videoRef.current;
        video.currentTime = time;
        setCurrentTime(time);

        captureSmoothZoomTransition(
            // 5, 25, 4000, 4000, 20,
            1)
    };

    const captureSmoothZoomTransition = (
        // startTime: number,
        // endTime: number,
        // zoomX: number,
        // zoomY: number,
        // targetScaleFactor: number,
        animationDuration: number,
    ): void => {
        const video = videoRef.current as HTMLVideoElement | null;
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        const outlineCanvas = canvasRef2.current as HTMLCanvasElement | null;

        if (video && canvas && outlineCanvas) {
            const ctx = canvas.getContext("2d");
            const outlineCtx = outlineCanvas.getContext("2d");

            if (ctx && outlineCtx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                outlineCanvas.width = video.videoWidth;
                outlineCanvas.height = video.videoHeight;


                const handleTimeUpdate = () => {
                    const [startTime, endTime, zoomX, zoomY, targetScaleFactor] = isInRange(video.currentTime, ranges);

                    if (video.currentTime >= startTime && video.currentTime <= endTime) {
                        var currentScaleFactor = targetScaleFactor;
                        var progress;
                        if (video.currentTime >= startTime && video.currentTime <= startTime + animationDuration) {
                            progress = Math.min((video.currentTime - (startTime)) / (animationDuration), 1);
                            currentScaleFactor = 1
                                + (targetScaleFactor - 1) * progress;
                        } else if (video.currentTime >= startTime + animationDuration && video.currentTime <= endTime) {
                            progress = Math.min((endTime - (video.currentTime)) / (animationDuration), 1);
                            currentScaleFactor = 1 +
                                (targetScaleFactor - 1) * progress;
                        }



                        const zoomWidth = video.videoWidth / currentScaleFactor;
                        const zoomHeight = video.videoHeight / currentScaleFactor;

                        const srcX = Math.max(0, Math.min(zoomX - zoomWidth / 2, video.videoWidth - zoomWidth));
                        const srcY = Math.max(0, Math.min(zoomY - zoomHeight / 2, video.videoHeight - zoomHeight));

                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);

                        ctx.drawImage(
                            video,
                            srcX, srcY,                // Source X and Y (top-left corner of the zoom area)
                            zoomWidth, zoomHeight,      // Source width and height (dimensions of the zoomed area)
                            0, 0,                       // Destination X and Y (top-left of the canvas)
                            canvas.width, canvas.height // Destination width and height (full canvas dimensions)
                        );

                        outlineCtx.drawImage(video, 0, 0, outlineCanvas.width, outlineCanvas.height);
                        outlineCtx.strokeStyle = "blue";
                        outlineCtx.lineWidth = 3;
                        outlineCtx.strokeRect(
                            srcX * (outlineCanvas.width / video.videoWidth),
                            srcY * (outlineCanvas.height / video.videoHeight),
                            zoomWidth * (outlineCanvas.width / video.videoWidth),
                            zoomHeight * (outlineCanvas.height / video.videoHeight)
                        );

                    } else {
                        handleCaptureFrame();
                        handleCaptureFrame2();
                    }


                };

                handleTimeUpdate();


            }
        } else {
            console.error("Video, canvas, or outlineCanvas element is not available.");
        }
    };

    const handleCaptureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
    };
    const handleCaptureFrame2 = () => {
        const video = videoRef.current;
        const canvas = canvasRef2.current;
        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
    };


    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            const video = videoRef.current;
            video.src = url;
            video.load();
            video.onloadedmetadata = () => {
                setDuration(video.duration)
                const estimatedFrameRate = video.videoHeight / video.duration;
                setFrameRate(estimatedFrameRate);
                console.log("loaded")
                play(0)
            };
            // setCanvas(0);

        }
    };


    return (
        <div>
            <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ marginBottom: "10px" }}
            />

            {videoSrc && (
                <div>
                    <div style={{ marginTop: "10px" }}>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            step="0.01"
                            value={currentTime}
                            onChange={(e) => {
                                handleTimeUpdateTime(parseFloat(e.target.value))
                            }}
                            style={{ width: "100%" }}
                        />
                        <div>
                            Time: {currentTime.toFixed(2)} / {duration.toFixed(2)} seconds
                        </div>
                    </div>
                    <div className="flex-row">
                        <button onClick={() => {
                            const video = videoRef.current;
                            console.log(video.currentTime * 1000)
                            play(video.currentTime * 1000);
                        }}>
                            {isPlaying ? "pause" : "play"}
                        </button>
                    </div>

                    <div className="flex p-4 w-screen gap-6">
                        <canvas
                            ref={canvasRef}
                            style={{
                                marginTop: "10px",
                                border: "1px solid black",
                                display: "block",
                                width: "45vw"
                            }}
                        />
                        <canvas
                            ref={canvasRef2}
                            style={{
                                marginTop: "10px",
                                border: "1px solid black",
                                display: "block",
                                width: "45vw"
                            }}
                        />
                    </div>

                </div>
            )}
        </div>
    )
}

export default VideoEditor