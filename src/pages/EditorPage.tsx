import React, { useState } from 'react'
import VideoEditor from '../components/VideoEditor'
import TimelineEditor from '../components/TimelineEditor'
import useZoomHook from '../hooks/ZoomHook'
import ZoomParameterDialog from '../components/ZoomParameterDialog'
import CustomInput from '../components/CustomInput'
import TextField from '../widgets/Textfield'
import SideBar from '../components/SideBar'
import FilledButton from '../widgets/FilledButton'
import Divider from '../widgets/Divider'
import { start } from 'repl'
import CreateZoomBlockDialog from '../components/CreateZoomBlockDialog'

const EditorPage = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

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
            </div>
            <div className='w-[300px] border border-BG_BORDER h-full bg-BG_GROUP_BLACK flex flex-col'>
                <div className='p-2'>
                    <FilledButton
                        text='add zoom block'
                        onClick={() => {
                            openDialog()

                        }}
                    />
                </div>
                <Divider />

                {zoomHook.activeIndex !== null ? (<SideBar
                    zoomInfo={zoomHook.zoomRange[zoomHook.activeIndex]}
                    boundaries={zoomHook.getMovementBoundaries(zoomHook.activeIndex)}
                    onchange={(e) => {
                        zoomHook.updateRange(zoomHook.activeIndex!, e)
                    }}
                />) : <></>}

                <div className='flex flex-col flex-grow'>

                </div>








            </div>


            {isDialogOpen && (
                <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
                    <CreateZoomBlockDialog
                        videoLength={50}
                        onSave={(e) => {
                            const isCreated = zoomHook.addRange(e)
                            if (isCreated) {
                                closeDialog()
                            }
                        }}
                    />
                </div>
            )}


        </div>
    )
}

export default EditorPage