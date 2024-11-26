import React, { useRef, useState } from "react";


const VideoRunner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [status, setStatus] = useState("Process and Download Video")

    const ranges: [number, number, number, number, number][] = [[5, 10, 500, 500, 2], [15, 20, 3000, 3000, 3], [25, 30, 500, 2000, 2], [30, 35, 2000, 500, 3]];

    // const zoomMap = new Map<[number, number], [number, number, number]>([
    //     [[5, 10], [500, 500, 2]],
    //     [[15, 20], [3000, 3000, 3]],
    //     [[25, 30], [500, 2000, 2]],
    //     [[30, 35], [2000, 500, 3]],
    // ]);

    // function isInRange(value: number, ranges: [number, number][]): [number, number] {
    //     for (const [start, end] of ranges) {
    //         if (value >= start && value <= end) {
    //             return [start, end];
    //         }
    //     }
    //     return [-100, -100];
    // }

    function isInRange(value: number, ranges: [number, number, number, number, number][]): [number, number, number, number, number] {
        for (const [start, end, zoomX, zoomY, scale] of ranges) {
            if (value >= start && value <= end) {
                return [start, end, zoomX, zoomY, scale];
            }
        }
        return [-100, -100, 2000, 2000, 1];
    }


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url); 
        }
    };

    const handleRecordAndDownload = async () => {

        setStatus("Processing")
        if (!videoSrc) {
            alert("Please upload a video first.");
            return;
        }

        // const startTime = 2; 
        // const endTime = 10;
        // const zoomX = 1000; 
        // const zoomY = 1000;
        // const targetScaleFactor = 3; 
        const animationDuration = 1;

        const video = videoRef.current;
        const canvas = canvasRef.current;

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
                    const currentTime = video.currentTime;

                    // Determine the zoom progress
                    let progress = 0;
                    let currentScaleFactor = 1;

                    // var startTime: number = -1;
                    // var endTime: number = -1;



                    const [startTime, endTime, zoomX, zoomY, targetScaleFactor] = isInRange(currentTime, ranges);


                    if (currentTime >= startTime && currentTime <= startTime + animationDuration) {
                        progress = (currentTime - startTime) / animationDuration;//??? while zooming int (rethink the logic if duration is longer )
                        currentScaleFactor = 1 + (targetScaleFactor - 1) * progress;
                    } else if (currentTime >= endTime - animationDuration && currentTime <= endTime) {
                        progress = (endTime - currentTime) / animationDuration; //??? while zooming out
                        currentScaleFactor = 1 + (targetScaleFactor - 1) * progress;
                    } else if (currentTime > startTime && currentTime < endTime) {
                        currentScaleFactor = targetScaleFactor;
                    }


                    const zoomWidth = video.videoWidth / currentScaleFactor;                     //? Zoom caliculation
                    const zoomHeight = video.videoHeight / currentScaleFactor;
                    const srcX = Math.max(0, Math.min(zoomX - zoomWidth / 2, video.videoWidth - zoomWidth));
                    const srcY = Math.max(0, Math.min(zoomY - zoomHeight / 2, video.videoHeight - zoomHeight));

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        video,
                        srcX, srcY,                // Source region (top-left corner)
                        zoomWidth, zoomHeight,      // Source dimensions
                        0, 0,                       // Destination (canvas top-left corner)
                        canvas.width, canvas.height // Destination dimensions (full canvas)
                    );

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
    };

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleFileUpload} />
            {videoSrc && <video ref={videoRef} src={videoSrc} controls style={{ display: "none" }} />}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button onClick={handleRecordAndDownload}>{status}</button>
        </div>
    );
}

export default VideoRunner