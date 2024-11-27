import React, { useRef, useState } from 'react'
import { ZoomInfo } from './ZoomHook';

interface VideoEditorProps {
    zoomRange: ZoomInfo[]
}

const ZoomProcessorHook = (props: VideoEditorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);

    const videoRef = useRef<HTMLVideoElement>(document.createElement("video")); // In-memory video element
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [frameRate, setFrameRate] = useState<number>(30);
    const [timeElapsed, setTimeElapsed] = useState(0);


    function isInRange(value: number): ZoomInfo {
        for (const zoomRange of props.zoomRange) {
            if (value >= zoomRange.start && value <= zoomRange.end) {
                return zoomRange;
            }
        }
        return {
            start: -100,
            end: -100,
            zoomX: 2000,
            zoomY: 2000,
            scale: 1,
            scalingDuration: 1
        };
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



    let timer: NodeJS.Timeout | null = null;

    const playAndPause = (currentTimeInMilliSeconds: number) => {
        const interval = frameRate; // The time interval for each update
        const endTime = duration * 1000; // The total duration in milliseconds

        console.log(isPlaying);

        if (isPlaying) {
            // Pause logic
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            setIsPlaying(false);
            console.log("Paused");
        } else {
            // Play logic
            setIsPlaying(true);
            timer = setInterval(() => {
                setTimeElapsed((prev) => {
                    const newElapsed = prev + interval;

                    if (currentTimeInMilliSeconds + newElapsed >= endTime) {
                        clearInterval(timer!);
                        timer = null;
                        setIsPlaying(false);
                        console.log("Timer finished!");
                        return endTime - currentTimeInMilliSeconds; // Cap at the end time
                    }

                    handleTimeUpdateTime((currentTimeInMilliSeconds + newElapsed) / 1000);

                    return newElapsed; // Increment the elapsed time
                });
            }, interval);

            console.log("Playing");
        }
    };

    const handleTimeUpdateTime = (value: number) => {
        const time = value;
        const video = videoRef.current;
        video.currentTime = time;
        setCurrentTime(time);

        captureSmoothZoomTransition()
    };


    const captureSmoothZoomTransition = (): void => {
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
                    const zoomInfo = isInRange(video.currentTime);

                    if (video.currentTime >= zoomInfo.start && video.currentTime <= zoomInfo.end) {
                        var currentScaleFactor = zoomInfo.scale;
                        var progress;
                        if (video.currentTime >= zoomInfo.start && video.currentTime <= zoomInfo.start + zoomInfo.scalingDuration) {
                            progress = Math.min((video.currentTime - (zoomInfo.start)) / (zoomInfo.scalingDuration), 1);
                            currentScaleFactor = 1
                                + (zoomInfo.scale - 1) * progress;
                        } else if (video.currentTime >= zoomInfo.start + zoomInfo.scalingDuration && video.currentTime <= zoomInfo.end) {
                            progress = Math.min((zoomInfo.end - (video.currentTime)) / (zoomInfo.scalingDuration), 1);
                            currentScaleFactor = 1 +
                                (zoomInfo.scale - 1) * progress;
                        }



                        const zoomWidth = video.videoWidth / currentScaleFactor;
                        const zoomHeight = video.videoHeight / currentScaleFactor;

                        const srcX = Math.max(0, Math.min(zoomInfo.zoomX - zoomWidth / 2, video.videoWidth - zoomWidth));
                        const srcY = Math.max(0, Math.min(zoomInfo.zoomY - zoomHeight / 2, video.videoHeight - zoomHeight));

                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);

                        ctx.drawImage(
                            video,
                            srcX, srcY,                // Source X and Y (top-left corner of the zoom area)
                            zoomWidth, zoomHeight,      // Source width and height (dimensions of the zoomed area)
                            0, 0,                       // Destination X and Y (top-left of the canvas)
                            canvas.width, canvas.height // Destination width and height (full canvas dimensions)
                        );
                        console.log("draw")
                        outlineCtx.drawImage(video, 0, 0, outlineCanvas.width, outlineCanvas.height);
                        outlineCtx.strokeStyle = "green";
                        outlineCtx.lineWidth = 10;
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
                console.log("draw 1")
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
                console.log("draw 2")
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
                video.currentTime = 0;
                video.oncanplay = () => {
                    requestAnimationFrame(() => {
                        handleCaptureFrame();
                        handleCaptureFrame2();
                    });
                };

            };
        }
    };

}

export default ZoomProcessorHook