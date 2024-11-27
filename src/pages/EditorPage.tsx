import React, { useRef, useState } from 'react'
import TimelineEditor from '../components/TimelineEditor'
import useZoomHook from '../hooks/ZoomHook'
import ZoomEditWidget from '../components/ZoomEditWidget'
import Divider from '../widgets/Divider'
import CreateZoomBlockDialog from '../components/CreateZoomBlockDialog'
import VideoPreview from '../components/VideoPreview'
import VideoExporter from '../components/VideoExporter'
import RightSideBar from '../components/RightSideBar'
import CropFreeIcon from '@mui/icons-material/CropFree';
import VerticalDivider from '../widgets/VerticalDivider'
interface EditorPageProps {
    videoSrc: string
    videoLength: number
}

const EditorPage = (props: EditorPageProps) => {

    const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const canvasRef2 = useRef<HTMLCanvasElement>(null);



    const zoomHook = useZoomHook(props.videoLength)
    return (
        <div className='h-screen w-screen flex bg-BG_CANVAS/50 glass-effect'>



            <div className='rounded-2xl flex-col flex flex-grow h-full'>
                <div className='p-4 flex-grow flex flex-col'>
                    <VideoPreview
                        videoSrc={props.videoSrc}
                        canvasRef2={canvasRef2}
                        zoomRange={zoomHook.zoomRange}
                    />
                </div>
                <div className='bg-BG_GROUP_BLACK flex border justify-items-center items-center border-x-0 border-b-0 border-t-BG_BORDER'>
                    <div className='m-4'>
                        <CropFreeIcon />
                    </div>
                    <VerticalDivider />

                    <TimelineEditor
                        activeIndex={zoomHook.activeIndex}
                        videoLengthInSeconds={props.videoLength}
                        ranges={zoomHook.zoomRange}
                        getMovementBoundaries={zoomHook.getMovementBoundaries}
                        updateRange={zoomHook.updateRange}
                    />
                </div>
            </div>

            <RightSideBar
                onAddZoomBlock={() => {
                    setIsZoomDialogOpen(true)
                }}
                onExport={() => {
                    setIsExportDialogOpen(true)
                }}
            >
                <canvas
                    ref={canvasRef2}
                    style={{

                        display: "block",
                        height: "20vh"
                    }}
                />
                <Divider />
                {zoomHook.activeIndex !== null ? (<ZoomEditWidget
                    zoomInfo={zoomHook.zoomRange[zoomHook.activeIndex]}
                    boundaries={zoomHook.getMovementBoundaries(zoomHook.activeIndex)}
                    onchange={(e) => {
                        zoomHook.updateRange(zoomHook.activeIndex!, e)
                    }}
                    onDelete={() => {
                        zoomHook.deleteZoomRangeItem(zoomHook.activeIndex!)
                    }}
                />) : <></>}
                <div className='flex flex-col flex-grow'>

                </div>
            </RightSideBar>


            {isZoomDialogOpen && (
                <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
                    <CreateZoomBlockDialog
                        videoLength={props.videoLength}
                        onSave={(e) => {
                            const isCreated = zoomHook.addRange(e)
                            if (isCreated) {
                                setIsZoomDialogOpen(false)
                            }
                        }}
                        onClose={() => {
                            setIsZoomDialogOpen(false)
                        }}
                    />
                </div>
            )}

            {isExportDialogOpen && (
                <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
                    <VideoExporter
                        videoSrc={props.videoSrc}
                        zoomRange={zoomHook.zoomRange}
                        onClose={() => {
                            setIsExportDialogOpen(false)
                        }}
                    />
                </div>
            )}


        </div>
    )
}

export default EditorPage