import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import DotLoader from "../assets/lottie/dot_loader.json";

interface FilledButtonProps {
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
  children?: any
}

const FilledButton = (props: FilledButtonProps) => {
  return (
    <button
      onClick={!props.isLoading ? props.onClick : undefined}
      className="block h-[36px] justify-items-center text-center justify-center items-center w-full bg-green-300 rounded-[6px] text-white"
      style={{
        backgroundColor:
          props.onClick || props.isLoading ? "#6B67F2FF" : "#67676724",
        color: props.onClick ? "white" : "#676767",
        fontWeight: 700,
        fontSize: 16,
      }}
    >
      {!props.isLoading ? (
        <>
          <>
            {props.children}
          </>
          {props.text}
        </>

      ) : (
        <Player src={DotLoader} className="player w-10" loop autoplay />
      )}
    </button>

  );
};

export default FilledButton;
