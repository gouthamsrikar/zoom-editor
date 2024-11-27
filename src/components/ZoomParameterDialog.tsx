import React, { useState } from 'react';

interface DialogProps {
    minTime: number;
    maxTime: number;
    maxX: number;
    maxY: number;
    onClose: () => void;
    onSubmit: (data: DialogData) => void;
}

interface DialogData {
    startTime: number;
    endTime: number;
    x: number;
    y: number;
    scaleFactor: number;
    animatedDuration?: { start: number; end: number };
}

const ZoomParameterDialog: React.FC<DialogProps> = ({ minTime, maxTime, maxX, maxY, onClose, onSubmit }) => {
    const [startTime, setStartTime] = useState<number | ''>('');
    const [endTime, setEndTime] = useState<number | ''>('');
    const [x, setX] = useState<number | ''>('');
    const [y, setY] = useState<number | ''>('');
    const [scaleFactor, setScaleFactor] = useState<number>(1);
    const [animated, setAnimated] = useState(false);
    const [startDuration, setStartDuration] = useState<number | ''>('');
    const [endDuration, setEndDuration] = useState<number | ''>('');

    const isTimeValid = typeof startTime === 'number' && typeof endTime === 'number' &&
        startTime >= minTime && endTime <= maxTime && startTime < endTime;
    const isCoordinateValid = typeof x === 'number' && typeof y === 'number' &&
        x >= 0 && x <= maxX && y >= 0 && y <= maxY;
    const isDurationValid = animated && typeof startDuration === 'number' && typeof endDuration === 'number'
        ? startDuration + endDuration <= (endTime as number) - (startTime as number)
        : true;

    const handleSubmit = () => {
        if (isTimeValid && isCoordinateValid && isDurationValid) {
            onSubmit({
                startTime: startTime as number,
                endTime: endTime as number,
                x: x as number,
                y: y as number,
                scaleFactor,
                animatedDuration: animated ? { start: startDuration as number, end: endDuration as number } : undefined,
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Edit Properties</h2>

                {/* Start and End Time */}
                <div className="mb-4">
                    <label className="block mb-1">Start Time</label>
                    <input
                        type="number"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value ? Number(e.target.value) : '')}
                        className={`border rounded w-full p-2 ${!isTimeValid && 'border-red-500'}`}
                        placeholder={`Min: ${minTime}`}
                    />
                    <label className="block mt-2 mb-1">End Time</label>
                    <input
                        type="number"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value ? Number(e.target.value) : '')}
                        className={`border rounded w-full p-2 ${!isTimeValid && 'border-red-500'}`}
                        placeholder={`Max: ${maxTime}`}
                    />
                    {!isTimeValid && <p className="text-red-500 text-sm">Times must be within range and Start is less than End</p>}
                </div>

                {/* Coordinates */}
                <div className="mb-4">
                    <label className="block mb-1">X Coordinate</label>
                    <input
                        type="number"
                        value={x}
                        onChange={(e) => setX(e.target.value ? Number(e.target.value) : '')}
                        className={`border rounded w-full p-2 ${!isCoordinateValid && 'border-red-500'}`}
                        placeholder={`0 - ${maxX}`}
                    />
                    <label className="block mt-2 mb-1">Y Coordinate</label>
                    <input
                        type="number"
                        value={y}
                        onChange={(e) => setY(e.target.value ? Number(e.target.value) : '')}
                        className={`border rounded w-full p-2 ${!isCoordinateValid && 'border-red-500'}`}
                        placeholder={`0 - ${maxY}`}
                    />
                    {!isCoordinateValid && <p className="text-red-500 text-sm">Coordinates must be within specified bounds.</p>}
                </div>

                {/* Scale Factor */}
                <div className="mb-4">
                    <label className="block mb-1">Scale Factor</label>
                    <input
                        type="number"
                        value={scaleFactor}
                        onChange={(e) => setScaleFactor(Number(e.target.value))}
                        className="border rounded w-full p-2"
                        min="0.1"
                        step="0.1"
                    />
                </div>

                {/* Animated Duration */}
                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={animated}
                            onChange={(e) => {
                                setAnimated(e.target.checked);
                                if (!e.target.checked) {
                                    setStartDuration('');
                                    setEndDuration('');
                                }
                            }}
                            className="form-checkbox"
                        />
                        <span>Enable Animated Duration</span>
                    </label>

                    {animated && (
                        <div className="mt-2 space-y-2">
                            <label className="block mb-1">Start Duration</label>
                            <input
                                type="number"
                                value={startDuration}
                                onChange={(e) => setStartDuration(e.target.value ? Number(e.target.value) : '')}
                                className={`border rounded w-full p-2 ${!isDurationValid && 'border-red-500'}`}
                            />
                            <label className="block mt-2 mb-1">End Duration</label>
                            <input
                                type="number"
                                value={endDuration}
                                onChange={(e) => setEndDuration(e.target.value ? Number(e.target.value) : '')}
                                className={`border rounded w-full p-2 ${!isDurationValid && 'border-red-500'}`}
                            />
                            {!isDurationValid && (
                                <p className="text-red-500 text-sm">Total duration must be less than or equal to time range.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ZoomParameterDialog;
