
interface InputNumberProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    endContent?: React.ReactNode;
}

const InputNumber: React.FC<InputNumberProps> = ({
    label,
    value,
    onChange,
    placeholder,
    endContent
}) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <div className="flex items-center">
                <input
                    className="w-full border border-gray-400 rounded-md p-2 mt-1"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    placeholder={placeholder}
                />
                {endContent && (
                    <>{endContent}</>
                )}
            </div>
        </div>
    );
}

export default InputNumber;