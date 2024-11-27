import React from "react";

interface DividerProps {
  color?: string;
}

const Divider = (props: DividerProps) => {
  return (
    <div
      className="w-full h-[1px] bg-BG_BORDER"
      style={{
        backgroundColor: props.color,
      }}
    />
  );
};

export default Divider;
