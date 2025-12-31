'use client'
import ORDER_STAUTS from '@/lib/order_status'
import React, { useEffect, useState } from 'react'
import { FaClipboardCheck, FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa'

const steps = [
    { label: 'Review', icon: FaClipboardCheck },
    { label: 'Accepted', icon: FaBox },
    { label: 'Shipped', icon: FaTruck },
    { label: 'Transit', icon: FaShippingFast },
    { label: 'Delivered', icon: FaCheckCircle },
]

const OrderTrackingProgressbar = ({ orderStatus, className }: { orderStatus: string, className: string }) => {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        switch (orderStatus) {
            case ORDER_STAUTS.PENDING:
                setCurrentStep(0)
                break;
            case ORDER_STAUTS.PLACED:
                setCurrentStep(1)
                break;
            case ORDER_STAUTS.DISPATCHED:
                setCurrentStep(2)
                break;
            case ORDER_STAUTS.TRANSIT:
                setCurrentStep(3)
                break;
            case ORDER_STAUTS.OFDELIVERY:
                setCurrentStep(3)
                break;
            case ORDER_STAUTS.DELIVERED:
                setCurrentStep(4)
                break;
        }
    }, [orderStatus])

    return (
        <div className={className}>
            {/* Desktop View */}
            <div className="hidden sm:block">
                <div className="relative">
                    {/* Progress Line Background */}
                    <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200" />
                    
                    {/* Progress Line Active */}
                    <div 
                        className="absolute top-3.5 left-0 h-0.5 bg-primary transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                    
                    {/* Steps */}
                    <div className="relative flex justify-between">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon
                            const isCompleted = index <= currentStep
                            const isCurrent = index === currentStep
                            
                            return (
                                <div key={step.label} className="flex flex-col items-center">
                                    <div className={`
                                        w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isCompleted 
                                            ? 'bg-primary text-white shadow shadow-primary/20' 
                                            : 'bg-gray-100 text-gray-400'
                                        }
                                        ${isCurrent ? 'ring-2 ring-primary/20' : ''}
                                    `}>
                                        <StepIcon className="w-3 h-3" />
                                    </div>
                                    <span className={`
                                        mt-1 text-[10px] font-medium transition-colors
                                        ${isCompleted ? 'text-primary' : 'text-gray-400'}
                                    `}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile View - Compact with full labels */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon
                        const isCompleted = index <= currentStep
                        const isCurrent = index === currentStep
                        
                        return (
                            <React.Fragment key={step.label}>
                                <div className="flex flex-col items-center">
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center transition-all
                                        ${isCompleted 
                                            ? 'bg-primary text-white' 
                                            : 'bg-gray-200 text-gray-400'
                                        }
                                        ${isCurrent ? 'ring-1 ring-primary/30' : ''}
                                    `}>
                                        <StepIcon className="w-2.5 h-2.5" />
                                    </div>
                                    <span className={`
                                        mt-1 text-[8px] font-medium text-center leading-tight
                                        ${isCompleted ? 'text-primary' : 'text-gray-400'}
                                    `}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`
                                        flex-1 h-[2px] mx-0.5 -mt-3
                                        ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}
                                    `} />
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrderTrackingProgressbar