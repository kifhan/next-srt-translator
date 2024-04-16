import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
    return (
        <div className=" h-full">
            <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700" style={{
                width: "120px",
            }}>
                <div className="h-6 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${(value / max) * 100}%`, color: "white" }}></div>

                <div className='flex justify-center w-full'>
                    <span className="text-sm text-center">{Math.round((value / max) * 100)}%</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;