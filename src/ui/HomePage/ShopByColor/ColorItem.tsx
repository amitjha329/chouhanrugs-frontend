import ColorDataModel from '@/types/ColorDataModel'
import Link from 'next/link'
import React from 'react'

const ColorItem = (props: ColorDataModel) => {
    const getTextColor = (hexColor: string) => {
        const rgb = hexToRgb(hexColor);
        if (!rgb) return "#000";

        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? "#000" : "#fff";
    };
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    return (
        <Link href={`/products?color=${props.name}`} className={`rounded-2xl shadow-md transition-all overflow-hidden relative flex items-center justify-center  ~w-16/20 ~h-16/20 cursor-pointer group hover:scale-105 hover:shadow-xl`} style={{
            backgroundColor: props.colorCode.hex
        }}>
            <span className='absolute text-[8px] z-10' style={{
                color: getTextColor(props.colorCode.hex), // Dynamically set text color
            }}>{props.name}</span>
            <div className={`~w-16/20 ~h-16/20 absolute group-hover:!bg-transparent z-20 transition-all`} style={{
                backgroundColor: props.colorCode.hex
            }}></div>
        </Link>
    )
}

export default ColorItem
