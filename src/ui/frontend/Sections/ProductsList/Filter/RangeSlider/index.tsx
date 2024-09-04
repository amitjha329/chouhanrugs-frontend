import React, { useState, useEffect } from "react";
import { useRange } from "react-instantsearch";
import { Label, Slider, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";
import clsx from "clsx";
import { useCurrencyContext } from "@/ui/frontend/Contexts/CurrencyContext";
const RangeSlider = () => {
    const { start, range, canRefine, refine } = useRange({
        attribute: "productSellingPrice"
    });
    const { userCurrency } = useCurrencyContext()
    const { min, max } = range;
    const [value, setValue] = useState<number[]>([min ?? 0, max ?? 0]);
    const thumbLabels = ["start", "end"]

    const from = Math.max(min as number, (Number.isFinite(start[0]) ? start[0] : min) as number);
    const to = Math.min(max as number, (Number.isFinite(start[1]) ? start[1] : max) as number);

    useEffect(() => {
        setValue([from, to]);
    }, [from, to]);

    useEffect(() => {
        console.log(range)
    }, [range]);

    return (
        <Slider
            aria-label="Price"
            defaultValue={[0, Number(max)]}
            minValue={min}
            maxValue={max}
            value={value}
            onChange={setValue}
            onChangeEnd={(val) => refine([val[0], val[1]])}
            isDisabled={!canRefine}
            className="grid grid-cols-[1fr_auto] flex-col items-center gap-2 w-64"
        >
            <Label>Price</Label>
            <SliderOutput className="text-sm text-gray-500 font-medium">
                {({ state }) =>
                    state.values.map((_, i) => `${userCurrency?.currencySymbol} ` + (Number(state.getThumbValueLabel(i)) * (userCurrency?.exchangeRates ?? 1) << 0)).join(' - ')}
            </SliderOutput>
            <SliderTrack className="group col-span-2 h-6 flex items-center">
                {({ state, isDisabled }) =>
                    <>
                        <div className={clsx("rounded-full w-full h-[6px]", { "bg-gray-100 dark:bg-zinc-800 forced-colors:bg-[GrayText]": isDisabled }, { "bg-gray-300 dark:bg-zinc-500 forced-colors:bg-[ButtonBorder]": !isDisabled })} />
                        {state.values.map((_, i) => (
                            <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]} className={({ isDragging, isDisabled }) => clsx("w-6 h-6 mt-6 rounded-full bg-gray-50 dark:bg-zinc-900 border-2 border-gray-700 dark:border-gray-300", { "border-gray-300 dark:border-zinc-700 forced-colors:border-[GrayText]": isDisabled }, { "bg-gray-700 dark:bg-gray-300 forced-colors:bg-[ButtonBorder]": isDragging })} />
                        ))}
                    </>}
            </SliderTrack>
        </Slider>
    )
}


export default RangeSlider;