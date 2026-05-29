import React, { useState, useEffect } from "react";
import { useRange } from "react-instantsearch";
import { Label, Slider, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";
import clsx from "clsx";
import Currency from "@/types/Currency";
const RangeSlider = ({ userCurrency }: { userCurrency: Currency }) => {
    const { start, range, canRefine, refine } = useRange({
        attribute: "productSellingPrice"
    });
    const { min, max } = range;
    const [value, setValue] = useState<number[]>([min ?? 0, max ?? 0]);
    const thumbLabels = ["start", "end"]

    const from = Math.max(min as number || 0, (Number.isFinite(start[0]) ? start[0] : min || 0) as number);
    const to = Math.min(max as number || 1000, (Number.isFinite(start[1]) ? start[1] : max || 1000) as number);

    useEffect(() => {
        setValue([from, to]);
    }, [from, to]);

    if (min === undefined || max === undefined) {
        return null;
    }

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
            className="grid w-full grid-cols-[1fr_auto] flex-col items-center gap-3"
        >
            <Label className="text-sm font-semibold text-[#2c211a]">Price Range</Label>
            <SliderOutput className="text-sm font-semibold text-[#6c4624]">
                {({ state }) =>
                    state.values.map((_, i) => `${userCurrency?.currencySymbol} ` + (Number(state.getThumbValueLabel(i)) * (userCurrency?.exchangeRates ?? 1) << 0)).join(' - ')}
            </SliderOutput>
            <SliderTrack className="group col-span-2 flex h-8 items-center">
                {({ state, isDisabled }) =>
                    <>
                        <div className={clsx("h-[5px] w-full rounded-full", { "bg-[#eee6dd] forced-colors:bg-[GrayText]": isDisabled }, { "bg-[#dccfc4] forced-colors:bg-[ButtonBorder]": !isDisabled })} />
                        {state.values.map((_, i) => (
                            <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]} className={({ isDragging, isDisabled }) => clsx("mt-8 h-6 w-6 rounded-full border-2 border-[#6c4624] bg-white shadow-[0_4px_12px_rgba(108,70,36,0.22)] outline-none ring-offset-2 transition-transform focus-visible:ring-2 focus-visible:ring-[#6c4624]/35", { "border-[#cdb9a7] forced-colors:border-[GrayText]": isDisabled }, { "scale-110 bg-[#f4ebe4] forced-colors:bg-[ButtonBorder]": isDragging })} />
                        ))}
                    </>}
            </SliderTrack>
        </Slider>
    )
}


export default RangeSlider;
