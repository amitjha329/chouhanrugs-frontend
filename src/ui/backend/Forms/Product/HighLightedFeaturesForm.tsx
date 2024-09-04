'use client';
import saveHighlightedFeatureForm from '@/lib/actions/saveHighlightedFeatureForm';
import onPageNotifications from '@/ui/common/onPageNotifications';
import { Switch } from '@headlessui/react'
import React, { useState } from 'react'

type propType = {
    productId: string
    productCustomizable: boolean
    productReturns: boolean
    productHandCrafted: boolean
    productFreedelivery: boolean
}

const HighLightedFeaturesForm = ({ productId, productCustomizable, productFreedelivery, productHandCrafted, productReturns }: propType) => {
    const [customizable, setCustomizable] = useState(productCustomizable)
    const [returnsAndReplacement, setReturnsAndReplacement] = useState(productReturns)
    const [handCrafted, setHandCrafted] = useState(productHandCrafted)
    const [freeDelivery, setFreeDelivery] = useState(productFreedelivery)
    return (
        <div className='card card-body card-bordered shadow-md mb-5'>
            <div className='card-title'>Product Highlighted Features</div>
            <div className='flex flex-row w-full justify-between'>
                <Switch.Group>
                    <Switch.Label>Customizable</Switch.Label>
                    <Switch
                        checked={customizable}
                        onChange={e => {
                            setCustomizable(!customizable)
                        }}
                        className={`${customizable ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span
                            className={`${customizable ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </Switch.Group>
                <Switch.Group>
                    <Switch.Label>Free Delivery</Switch.Label>
                    <Switch
                        checked={freeDelivery}
                        onChange={e => {
                            setFreeDelivery(!freeDelivery)
                        }}
                        className={`${freeDelivery ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span
                            className={`${freeDelivery ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </Switch.Group>
                <Switch.Group>
                    <Switch.Label>Hand Crafted</Switch.Label>
                    <Switch
                        checked={handCrafted}
                        onChange={e => {
                            setHandCrafted(!handCrafted)
                        }}
                        className={`${handCrafted ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span
                            className={`${handCrafted ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </Switch.Group>
                <Switch.Group>
                    <Switch.Label>Returns</Switch.Label>
                    <Switch
                        checked={returnsAndReplacement}
                        onChange={e => {
                            setReturnsAndReplacement(!returnsAndReplacement)
                        }}
                        className={`${returnsAndReplacement ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span
                            className={`${returnsAndReplacement ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </Switch.Group>
            </div>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' onClick={() => {
                    saveHighlightedFeatureForm(productId, customizable, freeDelivery, handCrafted, returnsAndReplacement).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Fetured Information Updated")
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Save</button>
            </div>
        </div>
    )
}

export default HighLightedFeaturesForm