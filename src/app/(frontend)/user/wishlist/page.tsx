import getUserAllWishlist from '@/lib/actions/getUserAllWishlist'
import AuthOpts from '@/lib/adapters/AuthOptions'
import WishlistProductList from '@/ui/frontend/Lists/WishlistProductList'
import { getServerSession } from 'next-auth'
import React from 'react'

const WishListPage = async () => {
    const session = await getServerSession(AuthOpts)
    const wishList = await getUserAllWishlist((session?.user as { id: string }).id, true)
    return (
        <div className="basis-full lg:basis-3/4">
            <div className="mx-auto px-4 sm:px-6">
                <div className="container mx-auto my-8 drop-shadow-lg card card-bordered bg-white">
                    <div className=' card-body min-h-[600px]'>
                        <div className='card-title'>Your Wishlist</div>
                        <div className='flex flex-col gap-5'>
                            <WishlistProductList productList={wishList?.items ?? []} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishListPage