
interface InputBoxProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
    label,
    value,
    onChange,
    placeholder,
    autoComplete,
}) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <input
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
            />
        </div>
    );
};

export default InputBox;