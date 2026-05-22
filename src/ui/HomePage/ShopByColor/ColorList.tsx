import { getColorsList } from '@/backend/serverActions/getColorsList'
import ColorDataModel from '@/types/ColorDataModel'
import React from 'react'
import ColorItem from './ColorItem'

const pickRandomColors = (colors: ColorDataModel[], limit: number) => {
    return [...colors]
        .filter(color => color.name && color.colorCode?.hex)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
}

const ColorList = async ({ limit = 12 }: { limit?: number }) => {
    const colors = pickRandomColors(await getColorsList(), limit)

    if (colors.length === 0) return null

    return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
            {colors.map(color => <ColorItem key={color._id} {...color} />)}
        </div>
    )
}

export { ColorList }
