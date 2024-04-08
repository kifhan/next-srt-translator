import { TrashIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import TextArea from "../TextArea";

export type SRT = {
    id: number;
    start: string;
    end: string;
    text: string;
};

interface SRTTableProps {
    srt?: SRT[];
    onChange: (srt: SRT[]) => void;
    readonly?: boolean;
}

const SRTTable: React.FC<SRTTableProps> = ({ srt, onChange, readonly }) => {
    const [newSRT, setNewSRT] = useState<SRT>({ id: 0, start: '', end: '', text: '' });

    const handleAddSRT = () => {
        if (!srt) return;
        if (newSRT.start >= newSRT.end) {
            alert('Start time must be less than end time');
            return;
        }

        if (newSRT.text === '') {
            alert('Text cannot be empty');
            return;
        }

        onChange([...srt, newSRT]);
        setNewSRT({ id: srt.length + 1, start: '', end: '', text: '' });
    };

    const handleDeleteSRT = (id: number) => {
        if (!srt) return;
        onChange(srt.filter((s) => s.id !== id));
    };

    const handleUpdateSRT = (id: number, field: 'start' | 'end' | 'text', value: string | number) => {
        if (!srt) return;
        onChange(srt.map((s) => {
            if (s.id === id) {
                return {
                    ...s,
                    [field]: value
                };
            }

            return s;
        }));
    };

    useEffect(() => {
        if (!srt) return;
        setNewSRT({ id: srt.length + 1, start: '', end: '', text: '' });
    }, [srt]);

    if (!srt) return null;

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left w-1/10">id&nbsp;</th>
                        {/* <th className="text-left w-1/6">Start</th>
                        <th className="text-left w-1/6">End</th> */}
                        <th className="text-left w-1/10">Text</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {srt.map((s) => (
                        <tr key={s.id}>
                            <td className="pr-2">
                                <span className="text-gray-500 bg-gray-100 rounded-md p-2">{s.id}</span>
                            </td>
                            {/* <td>
                                {!readonly ? <input
                                    type="number"
                                    className="w-full border border-gray-400 rounded-md p-2"
                                    value={s.start}
                                    onChange={(e) => handleUpdateSRT(s.id, 'start', parseInt(e.target.value))}
                                /> : s.start}
                            </td>
                            <td>
                                {!readonly ? <input
                                    type="number"
                                    className="w-full border border-gray-400 rounded-md p-2"
                                    value={s.end}
                                    onChange={(e) => handleUpdateSRT(s.id, 'end', parseInt(e.target.value))}
                                /> : s.end}
                            </td> */}
                            <td>
                                {!readonly ?
                                    <TextArea
                                        label=""
                                        description=""
                                        placeholder="Enter the text for the subtitle"
                                        value={s.text}
                                        minRows={1}
                                        onChange={(text) => handleUpdateSRT(s.id, 'text', text)}
                                    />
                                    :
                                    <div style={{ height: "46px", width: "100%", display: "flex", alignItems: "center" }}>
                                        {s.text}
                                    </div>}
                            </td>
                            <td>
                                {!readonly ? <button
                                    className="text-gray-500 bg-gray-100 rounded-md p-2"
                                    onClick={() => handleDeleteSRT(s.id)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button> : null}
                            </td>
                        </tr>
                    ))}

                    {/* {!readonly && <tr>
                        <td>
                            <input
                                type="number"
                                className="w-full border border-gray-400 rounded-md p-2"
                                value={newSRT.id}
                                onChange={(e) => setNewSRT({ ...newSRT, id: parseInt(e.target.value) })}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="w-full border border-gray-400 rounded-md p-2"
                                value={newSRT.start}
                                onChange={(e) => setNewSRT({ ...newSRT, start: e.target.value })}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="w-full border border-gray-400 rounded-md p-2"
                                value={newSRT.end}
                                onChange={(e) => setNewSRT({ ...newSRT, end: e.target.value })}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="w-full border border-gray-400 rounded-md p-2"
                                value={newSRT.text}
                                onChange={(e) => setNewSRT({ ...newSRT, text: e.target.value })}
                            />
                        </td>
                        <td>
                            <button
                                className="text-green-500 bg-green-100 rounded-md p-2"
                                onClick={handleAddSRT}
                            >
                                <PlusCircleIcon className="h-4 w-4" />
                            </button>
                        </td>
                    </tr>} */}
                </tbody>
            </table>
        </div>
    );
}

export default SRTTable;