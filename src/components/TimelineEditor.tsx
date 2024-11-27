import React, { useLayoutEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { ZoomInfo } from '../hooks/ZoomHook';

type Range = { start: number; end: number };

interface TimelineEditorProps {
    videoLengthInSeconds: number
    ranges: ZoomInfo[]
    updateRange: (index: number, zoomInfo: ZoomInfo) => void,
    getMovementBoundaries: (index: number) => {
        leftLimit: number;
        rightLimit: number;
    },
    activeIndex: number | null
}

const TimelineEditor = (props: TimelineEditorProps) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [parentWidth, setParentWidth] = useState(0);

    useLayoutEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setParentWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth(); // Initial width
        window.addEventListener('resize', updateWidth); // Update on resize
        return () => window.removeEventListener('resize', updateWidth);
    }, []);




    return (
        <div
            ref={containerRef}
            className='flex w-full flex-grow '
            style={{
                position: "relative",
                height: "100px",
            }}
        >
            {props.ranges.map((range, index) => {
                const { leftLimit, rightLimit } = props.getMovementBoundaries(index);

                const widthInPercentage = ((range.end - range.start) / props.videoLengthInSeconds) * 100;
                const startPostion = ((range.start) / props.videoLengthInSeconds);



                return (
                    <Rnd

                        key={index}
                        bounds="parent"
                        size={{ width: `${widthInPercentage}%`, height: '100%' }}
                        position={{ x: (startPostion) * parentWidth, y: 0 }}
                        onDrag={(e, d) => {
                            const parentNode = d.node.parentNode as HTMLElement;
                            const newStart = (d.x / parentNode.offsetWidth) * 100;
                            const newEnd = newStart + (((range.end - range.start) / props.videoLengthInSeconds) * 100);
                            const start = (newStart * props.videoLengthInSeconds) / 100;
                            const end = (newEnd * props.videoLengthInSeconds) / 100;

                            if (start >= leftLimit && end <= rightLimit) {
                                props.updateRange(index,
                                    {
                                        start: start,
                                        end: end,
                                        scale: range.scale,
                                        scalingDuration: range.scalingDuration,
                                        zoomX: range.zoomX,
                                        zoomY: range.zoomY
                                    }
                                );
                            }
                        }}
                        enableResizing={{
                            bottom: false,
                            bottomLeft: false,
                            bottomRight: false,
                            left: true,
                            right: true,
                            top: false,
                            topLeft: false,
                            topRight: false,

                        }}

                        onResize={(e, direction, ref, delta, position) => {
                            const parentNode = ref.parentNode as HTMLElement;
                            const newWidth = (ref.offsetWidth / parentNode.offsetWidth) * 100;
                            const newStart = (position.x / parentNode.offsetWidth) * 100;
                            const newEnd = newStart + newWidth;




                            const start = (newStart * props.videoLengthInSeconds) / 100;
                            const end = (newEnd * props.videoLengthInSeconds) / 100;



                            if (
                                (direction === 'left' && start >= leftLimit && end <= rightLimit) ||
                                (direction === 'right' && end <= rightLimit && start >= leftLimit)
                            ) {


                                props.updateRange(index,
                                    {
                                        start: start,
                                        end: end,
                                        scale: range.scale,
                                        scalingDuration: range.scalingDuration,
                                        zoomX: range.zoomX,
                                        zoomY: range.zoomY
                                    }
                                );
                            }
                        }}
                        style={{
                            position: "absolute",
                            // backgroundColor: "0xff0000000",
                            // border: "1px solid blue",

                        }}

                    >
                        <div className='h-full w-full bg-[#EEFF88] rounded-lg px-3 py-1'
                            onClick={() => {
                                props.updateRange(index, range);
                            }}
                            style={{
                                backgroundColor: props.activeIndex === index ? "#EEFF88" : "#676767"
                            }}
                        >
                            <div className='bg-BG_CANVAS text-black h-full w-full rounded-lg'>
                                <p> start time {range.start.toFixed(2)}</p>
                                <p> end time {range.end.toFixed(2)}</p>
                            </div>
                        </div>
                    </Rnd>
                );
            })}

        </div>
    );
};

export default TimelineEditor;
