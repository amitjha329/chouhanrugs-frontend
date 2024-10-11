import ColorDataModel from '@/types/ColorDataModel'
import React from 'react'

const ColorItem = (props: ColorDataModel) => {
    return (
        <div className={`rounded-2xl shadow-md transition-all overflow-hidden relative flex items-center justify-center  ~w-16/20 ~h-16/20 cursor-pointer group hover:scale-105 hover:shadow-xl`} style={{
            backgroundColor: props.colorCode.hex
        }}>
            <span className='absolute text-[8px] z-10 mix-blend-' style={{
                color: props.colorCode.hex,
            }}>{props.name}</span>
            <div className={`~w-16/20 ~h-16/20 absolute group-hover:!bg-transparent z-20 transition-all`} style={{
                backgroundColor: props.colorCode.hex
            }}></div>
        </div>
    )
}

export default ColorItem