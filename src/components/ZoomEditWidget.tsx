import React, { useEffect, useState } from 'react'
import TextField from '../widgets/Textfield'
import Checkbox from '../widgets/CheckBox'
import { ZoomInfo } from '../hooks/ZoomHook'
import FilledButton from '../widgets/FilledButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
interface ZoomEditWidgetProps {
    zoomInfo: ZoomInfo,
    boundaries: {
        leftLimit: number,
        rightLimit: number,
    }
    onchange?: (zoomInfo: ZoomInfo) => void
    onDelete: () => void

}



const ZoomEditWidget = (props: ZoomEditWidgetProps) => {

    const [startTime, setStartTime] = useState<string | undefined>();
    const [endTime, setEndTime] = useState<string | undefined>();
    const [zoomX, setX] = useState<string | undefined>();
    const [zoomY, setY] = useState<string | undefined>();
    const [scaleFactor, setScaleFactor] = useState<string | undefined>();
    const [animated, setAnimated] = useState(false);
    const [scaleDuration, setScaleDuration] = useState<string | undefined>();



    useEffect(() => {
        setStartTime(props.zoomInfo.start.toFixed(2))
        setEndTime(props.zoomInfo.end.toFixed(2))
        setX(props.zoomInfo.zoomX.toFixed(2))
        setY(props.zoomInfo.zoomY.toFixed(2))
        setScaleFactor(props.zoomInfo.scale.toFixed(2))
        setAnimated(props.zoomInfo.scalingDuration > 0)
        setScaleDuration(props.zoomInfo.scalingDuration.toFixed(2))
    }, [
        props.zoomInfo.start,
        props.zoomInfo.end,
        props.zoomInfo.zoomX,
        props.zoomInfo.zoomY,
        props.zoomInfo.scalingDuration,
        props.zoomInfo.scale
    ]);

    const startTimeError = startTime && (Number(startTime) < props.zoomInfo.start ? `start cannot be less than ${props.zoomInfo.start}` :
        Number(startTime) >= props.zoomInfo.end ? `start cannot be greater than ${props.zoomInfo.end}` :
            endTime && (Number(startTime) > Number(endTime)) ? "start time cannot be greater than end time" :
                undefined
    );

    const endTimeError = endTime && (Number(endTime) < props.zoomInfo.start ? `end cannot be less than ${props.zoomInfo.start}` :
        Number(endTime) > props.zoomInfo.end ? `end cannot be greater than ${props.zoomInfo.end}` :
            startTime && (Number(startTime) > Number(endTime)) ? "End time time cannot be less than start time" :
                undefined
    );

    const zoomXerror = zoomX && (Number(zoomX) < 0 ? "X co-ordinate cannot be less than 0" : undefined);
    const zoomYerror = zoomY && (Number(zoomY) < 0 ? "Y co-ordinate cannot be less than 0" : undefined);

    const scaleFactorYerror = scaleFactor && (Number(scaleFactor) <= 1 ? "zoom factor cannot be less than or equal 1 if zooming" : undefined);

    const scaleDurationError = (animated && scaleDuration) ? (Number(scaleDuration) < 0 ? 'zoom duration time cannot be less than 0' :
        startTime && endTime && (Number(scaleDuration) > Number(endTime) - Number(startTime)) ? 'zoom duration can be greater than the whole time block duration'
            : undefined) : undefined;


    const [error, setError] = useState<String | undefined>(undefined);

    useEffect(() => {
        setError(startTimeError ?? endTimeError ?? zoomXerror ?? zoomYerror ?? scaleFactorYerror ?? scaleDurationError)
    }, [
        startTimeError,
        endTimeError,
        zoomXerror,
        zoomYerror,
        scaleFactorYerror,
        scaleDurationError,
    ])

    return (
        <div className='flex-col h-fit w-fit   flex gap-4  bg-BG_GROUP_BLACK glass-effect p-4'>
            <div className='flex gap-2 justify-between items-center'>
                <p className='text-white text-xl px-1'>Zoom Parameters
                </p>
                <DeleteOutlineIcon onClick={props.onDelete} className='text-ERROR_RED' />
            </div>
            <div className='flex gap-2'>
                <div className='flex-col flex gap-2'>
                    <p className='text-white text-xs px-1'>Start time
                    </p>
                    <TextField
                        value={startTime}
                        textInputType='number'
                        onChange={(e) => {
                            setStartTime(e);
                        }}
                        error={
                            startTimeError !== undefined ? " " : undefined
                        }
                    />
                </div>
                <div className='flex-col flex gap-2'>
                    <p className='text-white text-xs px-1'>End time</p>
                    <TextField
                        textInputType='number'
                        value={endTime}
                        onChange={(e) => {
                            setEndTime(e)
                        }}
                        error={
                            endTimeError !== undefined ? " " : undefined
                        }
                    />
                </div>
            </div>

            <div className='flex gap-2'>
                <div className='flex-col flex gap-2'>
                    <p className='text-white text-xs px-1'>X coordinate</p>
                    <TextField
                        value={zoomX}
                        textInputType='number'
                        onChange={(e) => { setX(e) }}
                        error={
                            zoomXerror !== undefined ? " " : undefined
                        }
                    />
                </div>
                <div className='flex-col flex gap-2'>
                    <p className='text-white text-xs px-1'>Y coordinate</p>
                    <TextField
                        value={zoomY}
                        textInputType='number'
                        onChange={(e) => { setY(e) }}
                        error={
                            zoomYerror !== undefined ? " " : undefined
                        }
                    />
                </div>
            </div>
            <div className='flex-col flex gap-2'>
                <p className='text-white text-xs px-1'>Zoom Factor</p>
                <TextField
                    value={scaleFactor}
                    textInputType='number'
                    onChange={(e) => {
                        setScaleFactor(e)
                    }}
                    error={
                        scaleFactorYerror !== undefined ? " " : undefined
                    }
                />
            </div>
            <div className='flex-col flex gap-2'>
                <div className='flex justify-between gap-2'>
                    <p className='text-white text-xs px-1'>
                        Scale Duration <span className='text-white text-[8px] px-1'> (in seconds)</span>
                    </p>
                    <Checkbox
                        checked={animated}
                        label=''
                        onChange={(e) => {
                            setAnimated(e)
                        }}
                    />
                </div>
                {animated && (<TextField
                    value={scaleDuration}
                    textInputType={'number'}
                    onChange={(e) => { setScaleDuration(e) }}
                    error={
                        scaleDurationError !== undefined ? " " : undefined
                    }
                />)}
            </div>
            <div>
                <p className="px-[16px] text-center text-ERROR_RED font-normal  text-[8px] h-[16px] bg-red ">
                    {error}
                </p>
                <FilledButton
                    text='Save'
                    onClick={
                        (

                            (startTime && Number(startTime) >= props.boundaries.leftLimit)
                            &&
                            (endTime && Number(endTime) <= props.boundaries.rightLimit)
                            &&
                            (Number(startTime) < Number(endTime))
                            &&
                            (zoomX && Number(zoomX) >= 0)
                            &&
                            (zoomY && Number(zoomY) >= 0)
                            &&
                            (scaleFactor && Number(scaleFactor) > 1)
                            &&
                            (!animated || (animated && scaleDuration && Number(scaleDuration) > 0))
                            && (!error)
                        ) ?
                            () => {
                                if (props.onchange)
                                    props.onchange(
                                        {
                                            start: Number(startTime),
                                            end: Number(endTime),
                                            zoomX: Number(zoomX),
                                            zoomY: Number(zoomY),
                                            scale: Number(scaleFactor),
                                            scalingDuration: animated ? Number(scaleDuration) : 0
                                        }
                                    )
                            } : undefined}
                />
            </div>

            <div className='text-white/60 text-[8px]'>
                <p >
                    rules:
                </p>
                <p>1. start and end time cannot overlap with other intervals</p>
                <p>2. X and Y coordinate should be greater than or equal 0 always</p>
                <p>3. zoom factor should be greater than 2</p>
                <p>4. if scale duration enabled then it should be greater than 0</p>
            </div>




        </div>
    )
}

export default ZoomEditWidget