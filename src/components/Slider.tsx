
interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
}

const Slider: React.FC<SliderProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1
}) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <input
                type="range"
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
}

export default Slider;