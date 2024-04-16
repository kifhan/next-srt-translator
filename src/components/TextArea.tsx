import React, { useEffect, useState } from 'react';

// create react function component for selectbox using tailwindcss

interface TextAreaProps {
    label: string;
    value: string;
    description?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minRows?: number;
    minCols?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    value,
    description,
    onChange,
    placeholder,
    minRows = 1,
    minCols = 20
}) => {
    const [rows, setRows] = useState(minRows);
    const [cols, setCols] = useState(minCols);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    useEffect(() => {
        const lines = value.split('\n').length;
        setRows(Math.max(minRows, lines));

        const maxLength = value.split('\n').reduce((max, line) => Math.max(max, line.length), 0);
        setCols(Math.max(minCols, maxLength));
    }, [value, minRows, minCols]);

    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <textarea
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                value={value}
                onChange={handleOnChange}
                placeholder={placeholder}
                rows={rows}
                cols={cols}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                    // height: `${rows * 2.5}rem`
                }}
            />
            {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
        </div>
    );
};

export default TextArea;