import React from 'react'
import Divider from '../widgets/Divider'
import ZoomEditWidget from './ZoomEditWidget'
import FilledButton from '../widgets/FilledButton'
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface RightSideBarProps {
    onAddZoomBlock: () => void,
    onExport: () => void
    children: any

}

const RightSideBar = (props: RightSideBarProps) => {
    return (
        <div className='w-[300px] border border-BG_BORDER h-full bg-BG_GROUP_BLACK flex flex-col'>
            <div className='p-2'>
                <FilledButton
                    text='add zoom block'
                    onClick={props.onAddZoomBlock}
                />
            </div>
            <Divider />
            {props.children}
            <Divider />
            <div className='p-2'>
                <FilledButton
                    text='Export'
                    onClick={props.onExport}
                >
                    <FileDownloadIcon />
                </FilledButton>
            </div>
        </div>
    )
}

export default RightSideBar