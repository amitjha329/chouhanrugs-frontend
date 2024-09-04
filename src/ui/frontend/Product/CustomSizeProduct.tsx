'use client'
import { Dispatch, SetStateAction, useEffect, useState, MouseEventHandler } from "react"
import convert from 'convert'
import onPageNotifications from "@/ui/common/onPageNotifications"
import axiosInstance from "@/lib/utilities/axiosInastances"

type propTypes = {
    priceSqFt: number,
    setPrice: Dispatch<SetStateAction<number>>,
    addToCart: <T extends "round" | "rectangle">(selectedType: 0 | 1 | 2 | 3, dimensions: T extends "round" ? { diameter: number } : { length: number, width: number }) => void
}
const CustomSizeProduct = ({ priceSqFt, setPrice, addToCart }: propTypes) => {
    const [selectedType, setSelectedType] = useState<number>(0)
    const [selectedMeasurementType, setSelectedMeasurementType] = useState<number>(0)
    const [rectWidthOne, setRectWidthOne] = useState<number>(0)
    const [rectWidthTwo, setRectWidthTwo] = useState<number>(0)
    const [rectWidthFinal, setRectWidthFinal] = useState<number>(0)
    const [rectLengthOne, setRectlengthOne] = useState<number>(0)
    const [rectLengthTwo, setRectlengthTwo] = useState<number>(0)
    const [rectLengthFinal, setRectlengthFinal] = useState<number>(0)
    const [sqSideOne, setSqSideOne] = useState<number>(0)
    const [sqSideTwo, setSqSideTwo] = useState<number>(0)
    const [sqSideFinal, setSqSideFinal] = useState<number>(0)
    const [diameterOne, setDiameterOne] = useState<number>(0)
    const [diameterTwo, setDiameterTwo] = useState<number>(0)
    const [diameterFinal, setDiameterFinal] = useState<number>(0)
    useEffect(() => {
        switch (selectedType) {
            case 0:
                setPrice((rectWidthFinal || 0) * (rectLengthFinal || 0) * priceSqFt)
                break;
            case 1:
                setPrice(Math.PI * Math.pow((diameterFinal || 0) / 2, 2) * priceSqFt)
                break;
            case 2:
                setPrice(Math.pow(sqSideFinal || 0, 2) * priceSqFt)
                break;
            case 3:
                setPrice((rectWidthFinal || 0) * (rectLengthFinal || 0) * priceSqFt)
                break;
        }
    }, [selectedType, rectLengthOne, rectWidthOne, diameterFinal, sqSideFinal, rectLengthFinal, rectWidthFinal])

    const convertHandler = (newval: number, prevval: number, setAction: Dispatch<SetStateAction<number>>) => {
        let temp = 0
        switch (selectedMeasurementType) {
            case 0:
                temp = convert(newval, "inch").to("feet") + prevval
                break;
            case 1:
                temp = convert(newval, "meter").to("feet") + prevval
                break;
            case 2:
                temp = convert(newval, "centimeter").to("feet") + prevval
                break;
        }
        setAction(temp)
    }

    return (
        <div className='card card-body card-bordered shadow-md mb-5'>
            <div className='card-title'>Custom Size</div>
            <div className='flex gap-3'>
                <label className='input-group input-group-lg input-group-vertical'>
                    <span>Type</span>
                    <select defaultValue={0} className='select select-bordered w-full' onChange={e => { setSelectedType(Number(e.currentTarget.value)) }}>
                        <option value={0}>Rectangle</option>
                        <option value={1}>Round</option>
                        <option value={2}>Square</option>
                        <option value={3}>Runner</option>
                    </select>
                </label>
                <label className='input-group input-group-lg input-group-vertical'>
                    <span>Measurement In</span>
                    <select defaultValue={0} className='select select-bordered w-full' onChange={e => { setSelectedMeasurementType(Number(e.currentTarget.value)); setRectWidthFinal(0); setRectWidthOne(0); setDiameterFinal(0); setDiameterOne(0); setRectlengthOne(0); setRectlengthFinal(0); setSqSideFinal(0); setSqSideOne(0) }}>
                        <option value={0}>Feet</option>
                        <option value={1}>Meter</option>
                        <option value={2}>Centimeter</option>
                    </select>
                </label>
            </div>
            {
                (selectedType == 0 || selectedType == 3) && <>
                    <div className="leading-4">Dimensions</div>
                    <div className='flex gap-3'>
                        <label className='input-group input-group-lg input-group-vertical'>
                            <span>Width</span>
                            <div className="flex">
                                {
                                    selectedMeasurementType == 0 && <input type="text" placeholder="ft'" className='input !rounded-t-none !rounded-bl-lg !rounded-br-none input-bordered w-full' onChange={e => {
                                        setRectWidthOne(Number(e.currentTarget.value))
                                        convertHandler(rectWidthTwo, Number(e.currentTarget.value), setRectWidthFinal)
                                    }} />
                                }
                                <input type="text" placeholder={`${selectedMeasurementType == 0 ? "in''" : ""}${selectedMeasurementType == 1 ? "meter" : ""}${selectedMeasurementType == 2 ? "cm" : ""}`} className='input !rounded-t-none !rounded-br-lg !rounded-bl-none input-bordered w-full' onChange={e => {
                                    setRectWidthTwo(Number(e.currentTarget.value))
                                    convertHandler(Number(e.currentTarget.value), rectWidthOne, setRectWidthFinal)
                                }} />
                            </div>
                        </label>
                        <label className='input-group input-group-lg input-group-vertical'>
                            <span>Length</span>
                            <div className="flex">
                                {
                                    selectedMeasurementType == 0 && <input type="text" placeholder="ft'" className='input !rounded-t-none !rounded-bl-lg !rounded-br-none input-bordered w-full' onChange={e => {
                                        setRectlengthOne(Number(e.currentTarget.value))
                                        convertHandler(rectLengthTwo, Number(e.currentTarget.value), setRectlengthFinal)
                                    }} />
                                }
                                <input type="text" placeholder={`${selectedMeasurementType == 0 ? "in''" : ""}${selectedMeasurementType == 1 ? "meter" : ""}${selectedMeasurementType == 2 ? "cm" : ""}`} className='input !rounded-t-none !rounded-br-lg !rounded-bl-none  input-bordered w-full' onChange={e => {
                                    setRectlengthTwo(Number(e.currentTarget.value))
                                    convertHandler(Number(e.currentTarget.value), rectLengthOne, setRectlengthFinal)
                                }} />
                            </div>
                        </label>
                    </div>
                </>
            }
            {
                selectedType == 1 && <>
                    <div className="leading-4">Diameter</div>
                    <div className='flex gap-3'>
                        <label className='input-group input-group-lg input-group-vertical'>
                            <span>Width</span>
                            <div className="flex">
                                {
                                    selectedMeasurementType == 0 && <input type="text" placeholder="ft'" className='input !rounded-t-none !rounded-bl-lg !rounded-br-none input-bordered w-full' onChange={e => {
                                        setDiameterOne(Number(e.currentTarget.value))
                                        convertHandler(diameterTwo, Number(e.currentTarget.value), setDiameterFinal)
                                    }} />
                                }
                                <input type="text" placeholder={`${selectedMeasurementType == 0 ? "in''" : ""}${selectedMeasurementType == 1 ? "meter" : ""}${selectedMeasurementType == 2 ? "cm" : ""}`} className='input !rounded-t-none !rounded-br-lg !rounded-bl-none  input-bordered w-full' onChange={e => {
                                    setDiameterTwo(Number(e.currentTarget.value))
                                    convertHandler(Number(e.currentTarget.value), diameterOne, setDiameterFinal)
                                }} />
                            </div>
                        </label>
                    </div>
                </>
            }
            {
                selectedType == 2 && <>
                    <div className='flex gap-3'>
                        <label className='input-group input-group-lg input-group-vertical'>
                            <span>Side</span>
                            <div className="flex">
                                {
                                    selectedMeasurementType == 0 && <input type="text" placeholder="ft'" className='input !rounded-t-none !rounded-bl-lg !rounded-br-none input-bordered w-full' onChange={e => {
                                        setSqSideOne(Number(e.currentTarget.value))
                                        convertHandler(sqSideTwo, Number(e.currentTarget.value), setSqSideFinal)
                                    }} />
                                }
                                <input type="text" placeholder={`${selectedMeasurementType == 0 ? "in''" : ""}${selectedMeasurementType == 1 ? "meter" : ""}${selectedMeasurementType == 2 ? "cm" : ""}`} className='input !rounded-t-none !rounded-br-lg !rounded-bl-none  input-bordered w-full' onChange={e => {
                                    setSqSideTwo(Number(e.currentTarget.value))
                                    convertHandler(Number(e.currentTarget.value), sqSideOne, setSqSideFinal)
                                }} />
                            </div>
                        </label>
                    </div>
                </>
            }
            <button type="button" className="h-14 font-semibold rounded-xl btn btn-primary text-white w-full shrink" onClick={e => {
                switch (selectedType) {
                    case 0:
                    case 3:
                        addToCart<"rectangle">(selectedType, { length: rectLengthFinal, width: rectWidthFinal })
                        break;
                    case 2:
                        addToCart<"rectangle">(selectedType, { length: sqSideFinal, width: sqSideFinal })
                        break;
                    case 1:
                        addToCart<"round">(selectedType, { diameter: diameterFinal })
                        break;
                        break;
                }
            }}>
                Add to Cart
            </button>
        </div>
    )
}

export default CustomSizeProduct