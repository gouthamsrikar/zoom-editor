import React from "react";

interface GapProps {
  gap: number;
  direction: "vertical" | "horizontal";
}

const Gap = (props: GapProps) => {
  return (
    <div
      className="h-[60px]"
      style={{
        height: props.direction === "vertical" ? props.gap : undefined,
        width: props.direction === "horizontal" ? props.gap : undefined,
      }}
    />
  );
};

export default Gap;
