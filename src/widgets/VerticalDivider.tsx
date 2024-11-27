import React from 'react'

interface VerticalDividerProps {
    color?: string;
}

const VerticalDivider = (props: VerticalDividerProps) => {
    return (
        <div
            className="h-full w-[1px] bg-BG_BORDER"
            style={{
                backgroundColor: props.color,
            }}
        />
    )
}

export default VerticalDivider