'use client'
import saveProductActivation from '@/lib/actions/saveProductActivation'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useRouter } from 'next/navigation'
import React from 'react'

const FinalAction = ({ productId }: { productId: string }) => {
    const router = useRouter()
    return (
        <button className='btn btn-success' onClick={e => {
            saveProductActivation(productId, true).then((res) => {
                if (res.ack) {
                    onPageNotifications("success", "Product Published and Activated").then(() => {
                        router.push('/admin/products/list')
                    })
                } else {
                    console.log(res.result)
                }
            }).catch(err => console.log(err))
        }}>
            Publish Product
        </button>
    )
}

export default FinalAction