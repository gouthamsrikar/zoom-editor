import React, { useEffect, useRef, useState } from 'react'
import { ZoomInfo } from '../hooks/ZoomHook';
import './InputRange.css'
import { Player } from '@lottiefiles/react-lottie-player';
import DotLoader from "../assets/lottie/dot_loader.json";
import VerticalDivider from '../widgets/VerticalDivider';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

interface VideoEditorProps {
    zoomRange: ZoomInfo[],
    canvasRef2: React.RefObject<HTMLCanvasElement>
    videoSrc: string
}

const VideoPreview = (props: VideoEditorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const videoRef = useRef<HTMLVideoElement>(document.createElement("video")); // In-memory video element
    // const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [frameRate, setFrameRate] = useState<number>(30);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        load()
    }, [])


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
        const canvas2 = props.canvasRef2.current;
        video.currentTime = 0.0;
        if (video && canvas && canvas2) {
            const ctx = canvas.getContext("2d");
            const ctx2 = canvas.getContext("2d");
            if (ctx && ctx2) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas2.width = video.videoWidth;
                canvas2.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                ctx2.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
    }

    // const play = (currentTimeInMilliSeconds: number) => {
    //     const interval = frameRate;
    //     const endTime = duration * 1000;

    //     const timer = setInterval(() => {
    //         setTimeElapsed((prev) => {

    //             if (currentTimeInMilliSeconds + prev >= endTime) {
    //                 clearInterval(timer);

    //                 console.log("Timer finished!");
    //                 return prev + currentTimeInMilliSeconds;
    //             }
    //             console.log((currentTimeInMilliSeconds + prev + interval) / 1000);
    //             handleTimeUpdateTime((currentTimeInMilliSeconds + prev + interval) / 1000)

    //             return prev + interval;
    //         });
    //     }, interval);
    // }

    var timer: NodeJS.Timeout | null = null;

    var video: HTMLVideoElement | null = null;

    // const play = () => {
    //     if (video) {
    //         if (!video.paused && !video.ended) {
    //             captureSmoothZoomTransition();
    //             requestAnimationFrame(play)
    //         } else {
    //             setIsPlaying(false);

    //         }
    //         setTimeElapsed(video.currentTime * 1000)
    //     }

    // }

    // const testPlay = (currentTimeInMilliSeconds: number) => {
    //     if (!video) {
    //         video = videoRef.current as HTMLVideoElement | null;
    //         video?.play()
    //         play()
    //         setIsPlaying(true);
    //     } else {
    //         setTimeElapsed(video.currentTime * 1000)
    //         video.pause();
    //         video = null
    //         captureSmoothZoomTransition();
    //         setIsPlaying(false);
    //     }
    // }

    const play = () => {
        if (!videoRef.current.paused && !videoRef.current.ended) {
            captureSmoothZoomTransition();
            setCurrentTime(videoRef.current.currentTime)
            requestAnimationFrame(play)
        } else {
            setCurrentTime(videoRef.current.currentTime)
            setIsPlaying(false);
        }

    }


    const testPlay = () => {
        if (videoRef.current.paused) {
            setIsPlaying(true);
            videoRef.current?.play()
            play()
        } else {
            setCurrentTime(videoRef.current.currentTime)
            captureSmoothZoomTransition();
            setIsPlaying(false);
            videoRef.current.pause();
        }
    }



    const playAndPause = (currentTimeInMilliSeconds: number) => {
        const interval = frameRate; // The time interval for each update
        const endTime = duration * 1000; // The total duration in milliseconds



        if (isPlaying) {
            // Pause logic
            if (timer) {
                clearInterval(timer);
                timer = null;
                console.log("clear");
            }
            setIsPlaying(false);
            console.log("Paused");
        } else {
            // Play logic
            setIsPlaying(true);
            timer = setInterval(() => {
                console.log("logging")
                setTimeElapsed((prev) => {
                    const newElapsed = prev + interval;

                    if (currentTimeInMilliSeconds + newElapsed >= endTime) {
                        clearInterval(timer!);
                        timer = null;
                        setIsPlaying(false);
                        console.log("Timer finished!");
                        return endTime - currentTimeInMilliSeconds;
                    }

                    handleTimeUpdateTime((currentTimeInMilliSeconds + newElapsed) / 1000);

                    return newElapsed;
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
        const outlineCanvas = props.canvasRef2.current as HTMLCanvasElement | null;

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
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
    };
    const handleCaptureFrame2 = () => {
        const video = videoRef.current;
        const canvas = props.canvasRef2.current;
        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
    };

    const load = () => {
        if (props.videoSrc) {
            setIsLoading(true)
            const video = videoRef.current;
            video.src = props.videoSrc;
            video.load();
            video.onloadedmetadata = () => {
                setDuration(video.duration)
                const estimatedFrameRate = video.videoHeight / video.duration;
                setFrameRate(estimatedFrameRate);
                video.currentTime = 0;
                video.oncanplay = () => {
                    // Request animation frame to ensure the video is ready
                    requestAnimationFrame(() => {
                        handleCaptureFrame();
                        handleCaptureFrame2();
                    });
                    setIsLoading(false)
                };

            };
        }
    }


    return (
        <div className='flex-grow flex flex-col h-full w-full'>
            {!isLoading ? (
                <div className='w-full h-full flex flex-col justify-around'>

                    <div className="flex p-4  items-center justify-center w-full gap-6">
                        <canvas
                            className='h-full  shadow-[0px_0px_100px_#F6995234]   border-black rounded-[24px] border-[10px]'
                            ref={canvasRef}
                            style={{
                                display: "block",
                                width: "60vw"

                            }}
                        />
                    </div>
                    <div className='flex flex-col justify-items-center items-center gap-4'>
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
                            className='w-full slider'
                        />



                        <div className='bg-BG_GROUP_BLACK border text-center items-center justify-items-center flex rounded-lg gap-2 border-BG_BORDER p-2 w-fit'>
                            <div className="w-12">
                                <button onClick={() => {
                                    testPlay();
                                }}>
                                    {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleIcon />}
                                </button>
                            </div>
                            <VerticalDivider />
                            <div className='text-xs'>
                                time: {currentTime.toFixed(2)} / {duration.toFixed(2)} seconds
                            </div>


                        </div>
                    </div>
                </div>
            ) : (
                <div className='h-full w-full items-center justify-items-center'>
                    <Player src={DotLoader} className="player w-10" loop autoplay />
                </div>
            )
            }
        </div>
    )
}

export default VideoPreview