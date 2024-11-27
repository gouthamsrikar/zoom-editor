import React, { ChangeEventHandler } from "react";
import { error } from "console";
import Gap from "./Gap";

interface TextFieldProps {
    value?: string | number | undefined;
    onChange: (e: string) => void | undefined;
    onSubmit?: () => void;
    type?: 'number' | "text" | 'date';
    error?: string;
    hintText?: string | undefined;
    textInputType?: 'number' | "text" | 'date';
    maxLength?: number
}

const TextField = (props: TextFieldProps) => {
    return (
        <div className="w-full h-[36px] text-xs bg-BG_TEXTFIELD relative rounded-[8px]">
            <div
                className="h-[36px] w-full items-center bg-BG_TEXTFIELD justify-items-stretch border-[1px] flex  rounded-[8px] focus:border-[1px] focus:border-BORDER focus:ring-0"
                style={{
                    borderColor: props.error ? "#eb1c23" : "#333333",
                }}
            >
                <input
                    value={props.value}
                    type={props.textInputType}
                    onChange={(e) => {
                        props.onChange(e.target.value ?? '');
                    }}
                    placeholder={props.hintText}
                    onSubmit={props.onSubmit}
                    maxLength={props.maxLength}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && props.onSubmit) {
                            props.onSubmit();
                        }
                    }}

                    className="h-full bg-BG_TEXTFIELD px-[12px] py-[8px] w-full flex border-none rounded-[8px] outline-none text-white"
                />
                <Gap direction="horizontal" gap={16} />
            </div>
            <div className="px-[16px] text-ERROR_RED font-normal absolute bottom-[-18px] text-[8px] h-[16px] bg-red line-clamp-1 overflow-clip">
                {props.error}
            </div>
        </div>
    );
};

export default TextField;
