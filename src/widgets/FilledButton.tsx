// import { Player } from "@lottiefiles/react-lottie-player";
// import Button from "@mui/material/Button";
import React from "react";
// import DotLoader from "../assets/lottie/dot_loader.json";

interface FilledButtonProps {
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const FilledButton = (props: FilledButtonProps) => {
  return (
    <button
      onClick={!props.isLoading ? props.onClick : undefined}
      className="block h-[32px] text-center justify-center items-center w-full bg-green-300 rounded-[6px] text-white"
      style={{
        backgroundColor:
          props.onClick || props.isLoading ? "#6B67F2FF" : "#67676724",
        color: props.onClick ? "white" : "#676767",
        fontWeight: 700,
        fontSize: 16,
      }}
    >
      {!props.isLoading ? (
        props.text
      ) : (
        <></>
        // <Player src={DotLoader} className="player w-10" loop autoplay />
      )}
    </button>

    // <Button
    //   onClick={props.onClick}
    //   variant="contained"
    //   fullWidth={true}
    //   className="h-[48px] rounded-[6px] font-ubuntu"
    //   disableElevation={false}
    //   style={{
    //     backgroundColor: props.onClick ? "#00B140" : "#F4F4F4",
    //     color: props.onClick ? "white" : "#676767",
    //     fontWeight: 700,
    //     fontSize: 16,
    //     fontFamily: "ubuntu",
    //   }}
    //   disabled={props.onClick===null}
    // >
    //   hello
    //   {props.text}
    // </Button>
  );
};

export default FilledButton;
