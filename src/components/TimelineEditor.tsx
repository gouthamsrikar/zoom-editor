import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

type Range = { start: number; end: number };

const TimelineE: React.FC = () => {
    const [ranges, setRanges] = useState<Range[]>([
        { start: 2, end: 5 },
        { start: 7, end: 10 },
        { start: 50, end: 60 },
    ]);

    const addRange = (start: number, end: number) => {
        const newRange = { start, end };

        const overlap = ranges.some(
            (range) => start < range.end && end > range.start
        );
        if (overlap) {
            alert("New range overlaps with an existing range.");
            return;
        }

        const newRanges = [...ranges];
        const insertIndex = newRanges.findIndex(range => range.start > start);

        if (insertIndex === -1) {
            newRanges.push(newRange);
        } else {
            newRanges.splice(insertIndex, 0, newRange);
        }

        setRanges(newRanges);
    };

    const updateRange = (index: number, start: number, end: number) => {
        const updatedRanges = [...ranges];
        updatedRanges[index] = { start, end };
        setRanges(updatedRanges);
    };

    const getMovementBoundaries = (index: number) => {
        const leftLimit = index > 0 ? ranges[index - 1].end : 0;
        const rightLimit = index < ranges.length - 1 ? ranges[index + 1].start : 100;
        return { leftLimit, rightLimit };
    };

    return (
        <div
            className="timeline-container"
            style={{ position: "relative", width: "100%", height: "100px", backgroundColor: "#f0f0f0", border: "1px solid #ddd" }}
        >
            {ranges.map((range, index) => {
                const { leftLimit, rightLimit } = getMovementBoundaries(index);

                return (
                    <Rnd
                        key={index}
                        bounds="parent"
                        size={{ width: `${range.end - range.start}%`, height: '100%' }}
                        position={{ x: (range.start / 100) * window.innerWidth, y: 0 }}

                        onDrag={(e, d) => {
                            const parentNode = d.node.parentNode as HTMLElement;
                            const newStart = (d.x / parentNode.offsetWidth) * 100;
                            const newEnd = newStart + (range.end - range.start);

                            if (newStart >= leftLimit && newEnd <= rightLimit) {
                                updateRange(index, newStart, newEnd);
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

                            if (
                                (direction === 'left' && newStart >= leftLimit && newEnd <= rightLimit) ||
                                (direction === 'right' && newEnd <= rightLimit && newStart >= leftLimit)
                            ) {
                                updateRange(index, newStart, newEnd);
                            }
                        }}
                        style={{
                            position: "absolute",
                            backgroundColor: "lightblue",
                            border: "1px solid blue",
                        }}

                    >
                        Range {index + 1}
                    </Rnd>
                );
            })}
            <button onClick={() => addRange(20, 25)}>Add Range</button>
        </div>
    );
};

export default TimelineE;
