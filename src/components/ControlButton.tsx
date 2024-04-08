
interface ControlButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    color?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({
    label,
    onClick,
    disabled,
    color = "bg-blue-500"
}) => {

    return (
        <button
            className={`px-4 py-2 text-white rounded-md` + (!disabled ? "" : " opacity-50 cursor-not-allowed") + ` ${color}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default ControlButton;