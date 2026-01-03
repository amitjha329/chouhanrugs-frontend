import { getColorsList } from '@/backend/serverActions/getColorsList'
import React from 'react'
import ColorItem from './ColorItem'

const ColorList = async () => {
    const colors = await getColorsList()
    return (
        <>
            <div className='flex flex-wrap gap-4 justify-center items-center'>
                {
                    colors.slice(0, 12).map(color => <ColorItem key={color._id} {...color} />)
                }
            </div>
            <div className="collapse">
                <input type="checkbox" />
                <div className="collapse-title text-center text-primary">
                    View All &#9660;
                </div>
                <div className="collapse-content flex flex-wrap justify-center items-center gap-4 p-0">
                    {
                        colors.slice(12).map(color => <ColorItem key={color._id} {...color} />)
                    }
                </div>
            </div>
        </>
    )
}

const ColorListMobile = async () => {
    const colors = await getColorsList()
    return (
        <>
            <div className='flex flex-wrap justify-center items-center gap-4'>
                {
                    colors.slice(0, 6).map(color => <ColorItem key={color._id} {...color} />)
                }
            </div>
            <div className="collapse">
                <input type="checkbox" />
                <div className="collapse-title text-center text-primary">
                    View All &#9660;
                </div>
                <div className="collapse-content flex flex-wrap justify-center items-center gap-4 p-0">
                    {
                        colors.slice(6).map(color => <ColorItem key={color._id} {...color} />)
                    }
                </div>
            </div>
        </>

    )
}

export { ColorList, ColorListMobile }