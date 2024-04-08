import { useRef } from "react";

interface FileUploadButtonProps {
    label: string;
    onFileSelect: (file: File) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
    label,
    onFileSelect,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm font-semibold" htmlFor={label}>
                {label}
            </label>
            <div className="flex items-center mt-1">
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => inputRef.current?.click()}
                >
                    Select File
                </button>
            </div>
        </div>
    );
};

export default FileUploadButton;