import React, { useState } from 'react'

export type ZoomInfo = {
    start: number;
    end: number;
    zoomX: number;
    zoomY: number;
    scale: number;
    scalingDuration: number;
}

const useZoomHook = (videoLengthInSeconds: number) => {

    const [zoomRange, SetZoomRange] = useState<ZoomInfo[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);


    const addRange = (zoomInfo: ZoomInfo) => {

        const overlap = zoomRange.some(
            (range) => zoomInfo.start < range.end && zoomInfo.end > range.start
        );
        if (overlap) {
            alert("New range overlaps with an existing range.");
            return false;
        }



        const newRanges = [...zoomRange];
        const insertIndex = newRanges.findIndex(range => range.start > zoomInfo.start);

        if (insertIndex === -1) {
            newRanges.push(zoomInfo);
            setActiveIndex(0)
        } else {
            newRanges.splice(insertIndex, 0, zoomInfo);
            setActiveIndex(insertIndex)

        }


        SetZoomRange(newRanges);

        return true

    };

    const updateRange = (index: number, zoomInfo: ZoomInfo) => {
        const updatedRanges = [...zoomRange];
        updatedRanges[index] = zoomInfo;
        setActiveIndex(index);
        SetZoomRange(updatedRanges);
    };

    const getMovementBoundaries = (index: number) => {
        const leftLimit = index > 0 ? zoomRange[index - 1].end : 0;
        const rightLimit = index < zoomRange.length - 1 ? zoomRange[index + 1].start : videoLengthInSeconds;
        return { leftLimit, rightLimit };
    };




    return { zoomRange, addRange, updateRange, getMovementBoundaries, activeIndex }
}



export default useZoomHook