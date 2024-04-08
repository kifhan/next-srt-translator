import React, { FC, ChangeEvent } from 'react';

interface SelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    label: string;
}

const Select: FC<SelectProps> = ({ options, value, label, onChange }) => {
    return (
        <div className="inline-block relative w-64">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <select
                id={label}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            >
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M0 6l10 10 10-10z" />
                </svg>
            </div>
        </div>
    );
}

export default Select;