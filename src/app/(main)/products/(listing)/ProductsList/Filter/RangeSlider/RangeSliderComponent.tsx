'use client'
import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const RangeSliderComponent = ({ initialMin, initialMax, min, max, step = 100, priceCap, setMin, setMax }: {
    initialMin: number, initialMax: number, min: number, max: number, step: number, priceCap: number, setMin: Dispatch<SetStateAction<number>>, setMax: Dispatch<SetStateAction<number>>
}) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [minValue, setMinValue] = useState<number>(initialMin);
    const [maxValue, setMaxValue] = useState<number>(initialMax);

    const handleMin: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (maxValue - minValue >= priceCap && maxValue <= max) {
            if (parseInt(e.target.value) < maxValue) {
                setMinValue(parseInt(e.target.value));
                setMin(parseInt(e.target.value))
            }
        } else {
            if (parseInt(e.target.value) < minValue) {
                setMinValue(parseInt(e.target.value));
                setMin(parseInt(e.target.value))
            }
        }
    };

    const handleMax: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (maxValue - minValue >= priceCap && maxValue <= max) {
            if (parseInt(e.target.value) > minValue) {
                setMaxValue(parseInt(e.target.value));
                setMax(parseInt(e.target.value))
            }
        } else {
            if (parseInt(e.target.value) > maxValue) {
                setMaxValue(parseInt(e.target.value));
                setMax(parseInt(e.target.value))
            }
        }
    };

    useEffect(() => {
        if (progressRef.current != null) {
            progressRef.current.style.left = (minValue / max) * step + "%";
            progressRef.current.style.right = step - (maxValue / max) * step + "%";
        }
    }, [minValue, maxValue, max, step]);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <div className="text-center">
                    <span className="font-semibold mr-1"> Min</span>
                    <input
                        onChange={(e) => setMinValue(Number(e.target.value))}
                        type="number"
                        value={minValue}
                        className="input input-sm max-w-[85px]"
                    />
                </div>
                <div className="font-semibold text-lg"> - </div>
                <div className="text-center">
                    <span className="font-semibold mr-1"> Max</span>
                    <input
                        onChange={(e) => setMaxValue(Number(e.target.value))}
                        type="number"
                        value={maxValue}
                        className="input input-sm max-w-[85px]"
                    />
                </div>
            </div>

            <div className="mb-4">
                <div className="slider relative h-1 rounded-md bg-gray-300">
                    <div
                        className="absolute h-1 bg-blue-300 rounded"
                        ref={progressRef}
                    ></div>
                </div>

                <div className="range-input relative">
                    <input
                        onChange={handleMin}
                        type="range"
                        min={min}
                        step={step}
                        max={max}
                        value={minValue}
                        className="absolute w-full -top-1 h-1 bg-transparent appearance-none "
                    />

                    <input
                        onChange={handleMax}
                        type="range"
                        min={min}
                        step={step}
                        max={max}
                        value={maxValue}
                        className="absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default RangeSliderComponent