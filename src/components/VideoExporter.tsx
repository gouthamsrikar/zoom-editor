import React, { useRef, useState } from "react";
import { ZoomInfo } from "../hooks/ZoomHook";
import FilledButton from "../widgets/FilledButton";
import CancelIcon from '@mui/icons-material/Cancel';
import { Player } from "@lottiefiles/react-lottie-player";
import DotLoader from "../assets/lottie/dot_loader.json";


interface VideoRunnerProps {
    zoomRange: ZoomInfo[],
    videoSrc: string
    onClose: () => void
}

const VideoExporter = (props: VideoRunnerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState("Process and Download Video")


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




    const handleRecordAndDownload = async () => {

        if (status !== "Processing") {
            setStatus("Processing")
            if (!props.videoSrc) {
                alert("Please upload a video first.");
                return;
            }


            const video = videoRef.current as HTMLVideoElement | null;
            const canvas = canvasRef.current as HTMLCanvasElement | null;

            if (video && canvas) {
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    console.error("Canvas context not available.");
                    return;
                }


                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                //! Recording the canvas
                const stream = canvas.captureStream();
                const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
                const chunks: BlobPart[] = [];

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        setStatus(`processing ${event.timeStamp}`)
                        chunks.push(event.data);
                    }
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "video/webm" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "processed_video.webm";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setStatus("Processing success")
                };

                recorder.start();

                const drawFrame = () => {
                    if (!video.paused && !video.ended) {

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

                            ctx.drawImage(
                                video,
                                srcX, srcY,                // Source X and Y (top-left corner of the zoom area)
                                zoomWidth, zoomHeight,      // Source width and height (dimensions of the zoomed area)
                                0, 0,                       // Destination X and Y (top-left of the canvas)
                                canvas.width, canvas.height // Destination width and height (full canvas dimensions)
                            );

                        } else {
                            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                        }

                        requestAnimationFrame(drawFrame);
                    } else {
                        recorder.stop();
                    }
                };

                video.currentTime = 0;
                video.play();
                drawFrame();

            } else {
                setStatus("Processing failed")

                console.error("Video or canvas not available.");
            }
        }
    };

    return (
        <div className="p-4 h-fit flex flex-col gap-4 rounded-2xl border-BG_BORDER border w-[360px] bg-BG_GROUP_BLACK glass-effect ">
            {props.videoSrc && <video ref={videoRef} src={props.videoSrc} controls style={{ display: "none" }} />}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="flex justify-between w-full gap-2 items-center">
                {
                    status === "Processing success"
                        ? "Video Processed Succesfully" :
                        <FilledButton
                            onClick={handleRecordAndDownload}
                        >

                            <div className="flex h-full items-center justify-items-center gap-2">
                                {status}
                                {status === "Processing" && <Player src={DotLoader} className="player w-10" loop autoplay />}
                            </div>


                        </FilledButton>
                }

                {
                    status !== "Processing" &&
                    <CancelIcon
                        style={{ cursor: 'pointer', color: '#676767' }}
                        onClick={props.onClose}
                    />
                }
            </div>

        </div>
    );
}

export default VideoExporter