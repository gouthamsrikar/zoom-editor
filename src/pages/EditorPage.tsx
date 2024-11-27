import React from 'react'
import VideoEditor from '../components/VideoEditor'
import TimelineEditor from '../components/TimelineEditor'
import useZoomHook from '../hooks/ZoomHook'
import ZoomParameterDialog from '../components/ZoomParameterDialog'
import CustomInput from '../components/CustomInput'
import TextField from '../widgets/Textfield'
import SideBar from '../components/SideBar'
import FilledButton from '../widgets/FilledButton'
import Divider from '../widgets/Divider'

const EditorPage = () => {

    const zoomHook = useZoomHook(50)
    return (
        <div className='h-screen w-screen flex bg-BG_CANVAS'>
            {/* <div className="flex items-center justify-center  bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <div className="glass-effect bg-BG_GREY/15 p-8 rounded-lg shadow-lg">
                    <p className="text-white text-xl font-semibold">Cool Glass Effect!</p>
                </div>
            </div> */}



            <div className=' p-4 rounded-2xl flex-col flex-grow h-full'>
                <div className=' flex-grow'>
                    <VideoEditor
                        zoomRange={zoomHook.zoomRange}
                    />
                </div>
                <div className=''>
                    <TimelineEditor
                        activeIndex={zoomHook.activeIndex}
                        videoLengthInSeconds={50}
                        ranges={zoomHook.zoomRange}
                        getMovementBoundaries={zoomHook.getMovementBoundaries}
                        updateRange={zoomHook.updateRange}
                    />
                </div>

                {/* <TimelineEditor

                    videoLengthInSeconds={49}

                    ranges={zoomHook.zoomRange}
                    getMovementBoundaries={zoomHook.getMovementBoundaries}
                    updateRange={zoomHook.updateRange}
                /> */}
                <button onClick={() => zoomHook.addRange({
                    start: 5,
                    end: 10,
                    scale: 3,
                    scalingDuration: 1,
                    zoomX: 4000,
                    zoomY: 2000
                })}>Add Range</button>
            </div>
            <div className='w-[240px] border border-BG_BORDER h-full bg-BG_GROUP_BLACK'>
                {zoomHook.activeIndex !== null ? (<SideBar
                    zoomInfo={zoomHook.zoomRange[zoomHook.activeIndex]}
                    boundaries={zoomHook.getMovementBoundaries(zoomHook.activeIndex)}
                    onchange={(e) => {
                        zoomHook.updateRange(zoomHook.activeIndex!, e)
                    }}
                />) : <></>}

                <Divider />

                <div className='p-2'>
                    <FilledButton
                    text='add zoom block'
                        onClick={() => zoomHook.addRange({
                            start: 5,
                            end: 10,
                            scale: 3,
                            scalingDuration: 1,
                            zoomX: 4000,
                            zoomY: 2000
                        })}
                    />
                </div>





            </div>



            {/* <div className='h-fit bg-BG_GROUP_BLACK/80 p-4 '>

            </div> */}




            {/* <ZoomParameterDialog

                maxX={30}
                maxY={10}
                maxTime={100}
                minTime={10}
                onClose={() => { }}
                onSubmit={() => { }}
            /> */}



        </div>
    )
}

export default EditorPage