import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'
import getUserCartitems from '@/backend/serverActions/getUserCartitems'
import CartItem from '@/ui/Cart/CartItem'
import CartTotalSection from '@/ui/Cart/CartTotalSection'

const CartPage = async () => {
    const session = await auth()
    const cart = await getUserCartitems((session?.user as { id: string }).id)
    console.log(cart)
    return (
        <div className="container py-0 sm:py-10 mx-auto">
            <div className="flex shadow-none sm:shadow-lg rounded-none sm:rounded-md overflow-hidden flex-col">
                <div className="bg-white px-10 py-10">
                    <Link href="/">
                        <div className="flex font-semibold text-primary text-sm mb-7 cursor-pointer">
                            <svg
                                className="fill-current mr-2 text-primary w-4"
                                viewBox="0 0 448 512"
                            >
                                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                            </svg>
                            Continue Shopping
                        </div>
                    </Link>
                    <div className="flex justify-between border-b pb-8 mb-5 sm:mb-auto">
                        <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                        <h2 className="font-semibold text-2xl">{cart.length} Items</h2>
                    </div>
                    <div className="hidden sm:flex mt-10 mb-5 justify-between items-center">
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-64">
                            Product Details
                        </h3>
                        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">
                            Quantity
                        </h3>
                        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">
                            Price/Qty.
                        </h3>
                        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">
                            Total
                        </h3>
                    </div>
                    {
                        cart && cart.length > 0 ? cart.map((item, index) => <CartItem item={item} key={item._id} />) : <div className="flex w-full h-20 justify-center items center text-2xl opacity-50">Cart is empty.</div>
                    }
                    <CartTotalSection cartItems={cart} />
                </div>
            </div>
        </div>
    )
}

export default CartPage