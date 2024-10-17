'use client'
import BrandDataModel from '@/types/BrandDataModel'
import CategoriesDataModel from '@/types/CategoriesDataModel'
import ColorDataModel from '@/types/ColorDataModel'
import PatternDataModel from '@/types/PatternDataModel'
import ShapeDataModel from '@/types/ShapeDataModel'
import SizeDataModel from '@/types/SizeDataModel'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const SelectedFilters = ({ categories, brandList, allSizes, allColors, allPatterns, allShapes, selectedBrands, selectedColors, selectedSizes, selectedPatterns, selectedShapes }: {
    categories: CategoriesDataModel[],
    brandList: BrandDataModel[],
    allSizes: SizeDataModel[],
    allColors: ColorDataModel[],
    allShapes: ShapeDataModel[],
    allPatterns: PatternDataModel[],
    selectedColors: string[],
    selectedBrands: string[],
    selectedSizes: string[],
    selectedShapes: string[],
    selectedPatterns: string[],
}) => {
    const searchParams = useSearchParams()
    const [selectedCats, setSelectedCats] = useState<string[]>([])
    const [selectedBrnd, setSelectedBrands] = useState<string[]>(selectedBrands)
    const [selectedSiz, setSelectedSizes] = useState<string[]>(selectedSizes)
    const [selectedClr, setSelectedColors] = useState<string[]>(selectedColors)
    const [selectedShape, setSelectedShapes] = useState<string[]>(selectedShapes)
    const [selectedPattern, setSelectedPatterns] = useState<string[]>(selectedPatterns)

    useEffect(() => {
        const urlCats = searchParams?.get('cats') && (searchParams?.get('cats')?.toString() ?? "").split(',')
        const urlBrands = searchParams?.get('brands') && (searchParams?.get('brands')?.toString() ?? "").split(',')
        const urlSizes = searchParams?.get('size') && (searchParams?.get('size')?.toString() ?? "").split(',')
        const urlColors = searchParams?.get('color') && (searchParams?.get('color')?.toString() ?? "").split(',')
        const urlShapes = searchParams?.get('shape') && (searchParams?.get('shape')?.toString() ?? "").split(',')
        const urlPatterns = searchParams?.get('pattern') && (searchParams?.get('pattern')?.toString() ?? "").split(',')

        if (urlCats) {
            setSelectedCats(urlCats)
        }
        if (urlBrands) {
            setSelectedBrands(urlBrands)
        }
        if (urlSizes) {
            setSelectedSizes(urlSizes)
        }
        if (urlColors) {
            setSelectedColors(urlColors)
        }
        if (urlShapes) {
            setSelectedShapes(urlShapes)
        }
        if (urlPatterns) {
            setSelectedPatterns(urlPatterns)
        }
    }, [searchParams])

    return (
        <div className="flex p-4 overflow-x-scroll no-scrollbar">
            {
                (selectedCats.length > 0 && selectedCats.length != 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">Categories ({selectedCats.length})</span> : null
            }
            {
                (selectedCats.length == 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">{categories.find(cat => cat._id = selectedCats[0])?.name}</span> : null
            }
            {
                (selectedBrnd.length > 0 && selectedBrnd.length != 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">Brands ({selectedBrnd.length})</span> : null
            }
            {
                (selectedBrnd.length == 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">{brandList.find(brands => brands._id = selectedBrnd[0])?.name}</span> : null
            }
            {
                (selectedSiz.length > 0 && selectedSiz.length != 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">Sizes ({selectedSiz.length})</span> : null
            }
            {
                (selectedSiz.length == 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">{allSizes.find(size => size.name = selectedSiz[0])?.name}</span> : null
            }
            {
                (selectedClr.length > 0 && selectedSiz.length != 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">Colors ({selectedClr.length})</span> : null
            }
            {
                (selectedClr.length == 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">{allColors.find(color => color.name = selectedClr[0])?.name}</span> : null
            }

            {
                (selectedShape.length > 0 && selectedShape.length != 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">Colors ({selectedShape.length})</span> : null
            }
            {
                (selectedShape.length == 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">{allShapes.find(shape => shape.name = selectedShape[0])?.name}</span> : null
            }

            {
                (selectedPattern.length > 0 && selectedPattern.length != 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">Colors ({selectedPattern.length})</span> : null
            }
            {
                (selectedPattern.length == 1) ? <span className="text-blue-600 rounded-full bg-blue-200 px-3 mr-1 min-w-max">{allPatterns.find(pattern => pattern.name = selectedPattern[0])?.name}</span> : null
            }
        </div>
    )
}

export default SelectedFilters