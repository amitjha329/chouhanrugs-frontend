import ColorDataModel from '@/types/ColorDataModel'
import Link from 'next/link'
import React from 'react'

const ColorItem = (props: ColorDataModel) => {
    return (
        <Link href={`/products?color=${props.name}`} className={`rounded-2xl shadow-md transition-all overflow-hidden relative flex items-center justify-center  ~w-16/20 ~h-16/20 cursor-pointer group hover:scale-105 hover:shadow-xl`} style={{
            backgroundColor: props.colorCode.hex
        }}>
            <span className='absolute text-[8px] z-10 mix-blend-' style={{
                color: props.colorCode.hex,
            }}>{props.name}</span>
            <div className={`~w-16/20 ~h-16/20 absolute group-hover:!bg-transparent z-20 transition-all`} style={{
                backgroundColor: props.colorCode.hex
            }}></div>
        </Link>
    )
}

export default ColorItem