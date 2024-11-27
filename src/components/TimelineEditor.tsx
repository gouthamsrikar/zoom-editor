import React, { useLayoutEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { ZoomInfo } from '../hooks/ZoomHook';


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

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);




    return (
        <div

            ref={containerRef}
            className='flex w-fit flex-grow m-2'
            style={{
                position: "relative",
                height: "80px",
            }}
        >
            {props.ranges.map((range, index) => {
                const { leftLimit, rightLimit } = props.getMovementBoundaries(index);

                const widthInPercentage = ((range.end - range.start) / props.videoLengthInSeconds) * 100;
                const startPostion = ((range.start) / props.videoLengthInSeconds);



                return (
                    <Rnd
                        className='opacity-70'
                        key={index}
                        bounds="parent"
                        size={{ width: `${widthInPercentage}%`, height: '100%' }}
                        position={{ x: (startPostion) * parentWidth, y: 0 }}
                        onDrag={(e, d) => {
                            const parentNode = d.node.parentNode as HTMLElement;
                            var newStart = ((d.x / parentNode.offsetWidth) * 100);
                            newStart = Number(newStart.toExponential(2))
                            const gap = (((range.end - range.start) / props.videoLengthInSeconds) * 100)
                            const newEnd = newStart + Number(gap.toExponential(2));
                            var start = (newStart * props.videoLengthInSeconds) / 100;
                            start = Number(start.toExponential(2))
                            var end = (newEnd * props.videoLengthInSeconds) / 100;
                            end = Number(end.toExponential(2))


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


                            var start = (newStart * props.videoLengthInSeconds) / 100;
                            var end = (newEnd * props.videoLengthInSeconds) / 100;

                            if (direction === 'left') {
                                end = range.end
                            } else if (direction === 'right') {
                                start = range.start
                            }

                            if (
                                (direction === 'left' && start >= leftLimit && end <= rightLimit) ||
                                (direction === 'right' && end <= rightLimit && start >= leftLimit)
                            ) {

                                props.updateRange(index,
                                    {
                                        start: Number(start.toExponential(2)),
                                        end: Number(end.toExponential(2)),
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
                        }}
                        resizeHandleStyles={{
                            left: {
                                width: "10px",
                                backgroundColor: props.activeIndex === index ? "#6B67F2FF" : "#ffffff",
                                height: "100%",
                                borderRadius: "5px 0px 0px 5px"
                            },
                            right: {
                                width: "10px",
                                backgroundColor: props.activeIndex === index ? "#6B67F2FF" : "#ffffff",
                                height: "100%",
                                borderRadius: "0px 5px 5px 0px"
                            }
                        }}

                    >
                        <div className='h-full w-full  px-1 py-1'
                            onClick={() => {
                                props.updateRange(index, range);
                            }}
                            style={{
                                backgroundColor: props.activeIndex === index ? "#6B67F2FF" : "#ffffff",

                            }}
                        >
                            <div className='bg-BG_GROUP_BLACK  text-white text-[8px] p-2 h-full w-full rounded-[8px]'>
                                <p className='px-1'> start time {range.start.toFixed(2)}</p>
                                <p className='px-1'> end time {range.end.toFixed(2)}</p>
                            </div>
                        </div>
                    </Rnd>
                );
            })}

        </div>
    );
};

export default TimelineEditor;
