import React from 'react';

interface CustomInputProps {
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    type?: string;
    className?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
    value,
    onChange,
    placeholder = '',
    type = 'text',
    className = '',
    disabled = false,
    min,
    max,
    step,
}) => {

    const themeClasses =
        'bg-gray-800 text-white border-gray-600 placeholder-gray-400';

    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`${themeClasses} border rounded-md px-3 py-2 ${className}`}
        />
    );
};

export default CustomInput;
