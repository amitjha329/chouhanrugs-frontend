"use client"
import React, { MouseEventHandler, useState } from 'react'
import ProductsCardStyle from './WishlistButton.module.scss'
import clsx from 'clsx'
import { ProductDataModel } from '@/types/ProductDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import addProductToWishlist from '@/backend/serverActions/addProductToWishlist'
import { useSession } from 'next-auth/react'


const WishListButton = ({ productDetails }: { productDetails: ProductDataModel }) => {
    const [wishAnimate, setWishAnimate] = useState(false)
    const { wishlistItems, refreshWishList } = useDataConnectionContext()
    const { data: session } = useSession()

    const addToWishlist: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        !wishlistItems.includes((productDetails._id ?? productDetails.objectID).toString() ?? "") ? addProductToWishlist(productDetails._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Added To Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() }) : deleteProductFromWishlist(productDetails._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Removed From Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() })
        setWishAnimate(!wishAnimate)
    }
    return (
        <div className={clsx("flex text-xs items-center bg-white rounded-badge p-0 text-black top-2 absolute z-50 cursor-pointer",
            wishAnimate ? ` ${ProductsCardStyle.active} ${ProductsCardStyle.animate}` : "", ProductsCardStyle.wish_button
        )}
            onClick={addToWishlist}
        >
            <svg
                width="35px"
                height="25px"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g fill="none" fillRule="evenodd">
                    <path
                        className={ProductsCardStyle.heart_stroke}
                        d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z"
                        fill="#e20000"
                    />
                    <path
                        className={ProductsCardStyle.heart_full}
                        d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z"
                        fill="#e20000"
                    />
                    <path
                        className={ProductsCardStyle.heart_lines}
                        d="M26,4 L30.6852129,0.251829715"
                        stroke="#e20000"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <path
                        className={ProductsCardStyle.heart_lines}
                        d="M2.314788,4 L7.00000086,0.251829715"
                        stroke="#e20000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        transform="matrix(-1 0 0 1 10.314788 1)"
                    />
                    <path
                        className={ProductsCardStyle.heart_lines}
                        d="M27,12 L33,12"
                        stroke="#e20000"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <path
                        className={ProductsCardStyle.heart_lines}
                        d="M0,12 L6,12"
                        stroke="#e20000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        transform="matrix(-1 0 0 1 7 1)"
                    />
                    <path
                        className={ProductsCardStyle.heart_lines}
                        d="M24,19 L28.6852129,22.7481703"
                        stroke="#e20000"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <path
                        className={ProductsCardStyle.heart_lines}
                        d="M4.314788,19 L9.00000086,22.7481703"
                        stroke="#e20000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        transform="matrix(-1 0 0 1 14.314788 1)"
                    />
                </g>
            </svg>
        </div>
    )
}

export default WishListButton