import React from "react";

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="hidden"
            />
            <span
                className={`w-5 h-5 flex items-center justify-center rounded border-2 ${checked ? "bg-blue-600 border-blue-600" : "border-gray-400"
                    }`}
            >
                {checked && <span className="text-white text-xs">✔</span>}
            </span>
            <span className="text-gray-700">{label}</span>
        </label>
    );
};

export default Checkbox;
