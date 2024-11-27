import React, { useEffect, useState } from 'react'
import TextField from '../widgets/Textfield'
import Checkbox from '../widgets/CheckBox'
import { ZoomInfo } from '../hooks/ZoomHook'
import FilledButton from '../widgets/FilledButton'

interface CreateZoomBlockDialogProps {
    onSave: (zoomInfo: ZoomInfo) => void
    videoLength: number
}



const CreateZoomBlockDialog = (props: CreateZoomBlockDialogProps) => {

    const [startTime, setStartTime] = useState<string | undefined>();
    const [endTime, setEndTime] = useState<string | undefined>();
    const [zoomX, setX] = useState<string | undefined>();
    const [zoomY, setY] = useState<string | undefined>();
    const [scaleFactor, setScaleFactor] = useState<string | undefined>();
    const [animated, setAnimated] = useState(true);
    const [scaleDuration, setScaleDuration] = useState<string | undefined>();





    return (
        <div className='flex-col rounded-2xl h-fit w-fit border border-BG_BORDER   flex gap-4  bg-BG_GROUP_BLACK glass-effect p-4'>
            <p className='text-white text-xl px-1'>Zoom Parameters
            </p>
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
                            startTime && Number(startTime) < 0 ? `start > 0` : undefined
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
                            endTime && Number(endTime) > props.videoLength ? `end > ${props.videoLength}` : undefined
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
                    />
                </div>
                <div className='flex-col flex gap-2'>
                    <p className='text-white text-xs px-1'>Y coordinate</p>
                    <TextField
                        value={zoomY}
                        textInputType='number'
                        onChange={(e) => { setY(e) }}
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
                        scaleDuration && Number(scaleDuration) < 0 ? `scaleDuration < 0` : undefined
                    }
                />)}
            </div>

            <FilledButton
                text='Create Zoom block'
                onClick={
                    (

                        (startTime && Number(startTime) >= 0)
                        &&
                        (endTime && Number(endTime) <= props.videoLength)
                        &&
                        (Number(startTime) < Number(endTime))
                        &&
                        (zoomX && Number(zoomX) > 0)
                        &&
                        (zoomY && Number(zoomY) > 0)
                        &&
                        (scaleFactor && Number(scaleFactor) > 1)
                        &&
                        (!animated || (animated && scaleDuration && Number(scaleDuration) > 0))
                    ) ?
                        () => {

                            props.onSave(
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




export default CreateZoomBlockDialog
