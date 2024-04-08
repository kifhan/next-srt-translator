
interface SwitchProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
    label,
    value,
    onChange,
}) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <div className="flex items-center mt-1">
                <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md border border-gray-400"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="ml-2 text-sm">{value ? 'Enabled' : 'Disabled'}</span>
            </div>
        </div>
    );
};

export default Switch;