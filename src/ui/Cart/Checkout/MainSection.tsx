// @ts-nocheck
'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo, useEffect, Fragment, useCallback } from 'react'
import { BsPlus } from 'react-icons/bs'
import clsx from 'clsx'
import { Orders } from 'razorpay/dist/types/orders'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { GrFormClose } from 'react-icons/gr'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './Stripe/CheckoutForm'
import { Session } from 'next-auth'
import CardForm from './PayPal/CardForm'
import UserAddressForm from '@/app/(main)/user/address/UserAddressForm'
import { capturePayment, createOrder } from '@/backend/serverActions/paypal'
import stringEmptyOrNull, { stringNotEmptyOrNull } from '@/lib/stringEmptyOrNull'
import CouponDataModel from '@/types/CouponDataModel'
import OrderDataModel from '@/types/OrderDataModel'
import SiteDataModel from '@/types/SiteDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import getUserAddressList from '@/backend/serverActions/getUserAddressList'
import getUserCartitems from '@/backend/serverActions/getUserCartitems'
import CartDataModel from '@/types/CartDataModel'
import PaymentGatewayDataModel from '@/types/PaymentGatewayDataModel'
import ShippingDataModel from '@/types/ShippingDataModel'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import PayMethodItem from './PayMethodItem'
import ShippingSelector from './ShippingSelector'
import Currency from '@/types/Currency'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import verifyRazorpayPayment from '@/backend/serverActions/verifyRazorpayPayment'
import Loader from '@/ui/Loader'
import saveOrderAfterPay from '@/backend/serverActions/saveOrderAfterPay'
import generateRazorPayOrder from '@/backend/serverActions/generateRazorPayOrder'
import validateCoupon from '@/backend/serverActions/validateCoupon'
import generateStripePaymentIntent from '@/backend/serverActions/generateStripePaymentIntent'
import CartItemClient from '../CartItemClient'
import { PayPalButtons } from '@paypal/react-paypal-js'

var calledStripeFinal = 0
const MainSection = ({ siteInfo, payOpts, stripeKey, queryParams, session, shippingList, userCurrency }: {
    siteInfo: SiteDataModel,
    payOpts: PaymentGatewayDataModel[],
    shippingList: ShippingDataModel[]
    stripeKey: string | undefined,
    queryParams: { [key: string]: string | string[] | undefined }
    session: Session | null,
    userCurrency: Currency
}) => {
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>()
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
    const router = useRouter()
    const { cartCount } = useDataConnectionContext()
    const [cart, setCart] = useState<CartDataModel[]>([])
    const [cartTotal, setCartTotal] = useState(0)
    const [addresses, setaddress] = useState<UserAddressDataModel[]>([])
    const [cartLoading, setcartLoading] = useState(true)
    const [addressLoading, setAddrLoading] = useState(true)
    const [razorPayOrder, setRazorPayOrder] = useState<Orders.RazorpayOrder>()
    const [couponCode, setCouponCode] = useState("")
    const [deductable, setDeductable] = useState(0)
    const [showStripe, setShowStripe] = useState(false)
    const [addAddress, setAddAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState<UserAddressDataModel | null>(null)
    // const [taxation, setTaxation] = useState<TaxationDataModel[]>([])
    const [taxation, setTaxation] = useState<[]>([])
    const [pg] = useState<PaymentGatewayDataModel[]>(payOpts)
    const [couponData, setCouponData] = useState<{
        couponApplicable: boolean,
        couponData: CouponDataModel
    }>()
    const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayDataModel | null>()
    const currentTax = useMemo(() => {
        // return taxation.find(item => item.ISO === userCurrency?.ISO) ?? { taxRate: 0 }
        return userCurrency?.ISO == "IN" ? { taxRate: 5 } : { taxRate: 0 }
    }, [userCurrency, taxation])
    const currentShipping = selectedAddress && shippingList.filter((ship) => ship.country.toLowerCase() === selectedAddress.country.toLowerCase())[0]
    // const orderTotal = useMemo(() => {
    //     return Number(cartTotal + (currentShipping ? parseFloat(currentShipping.shippingCharges.split(' ')[1]) : 0)) - deductable
    // }, [currentTax, currentShipping, cartTotal, deductable])
    const orderTotal = useMemo(() => {
        return Number(cartTotal + (currentShipping ? parseFloat(currentShipping.shippingCharges.split(' ')[1]) : 0)) + Number((cartTotal * currentTax.taxRate / 100).toFixed(2)) - deductable
    }, [currentTax, currentShipping, cartTotal, deductable])
    const payEnabled = useMemo(() => {
        return cartCount != 0 && paymentMethod && paymentMethod.partner != undefined && currentShipping != undefined
    }, [cartCount, paymentMethod, currentShipping])

    const calculateProductPrice = (item: CartDataModel): number => {
        var priceInitial = 0
        if (stringNotEmptyOrNull(item.variationCode) && item.variationCode != "customSize") {
            const variationindex = item.cartProduct[0].variations.findIndex(ff => ff.variationCode == item.variationCode!)
            priceInitial = (Number(item.cartProduct[0].variations[variationindex].variationPrice) - Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationPrice) * (Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationDiscount ?? 0) / 100)) >> 0
        } else if (item.variationCode == "customSize") {
            switch (item.customSize?.shape) {
                case "Rectangle":
                case "Runner":
                case "Square":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
                    break;
                case "Round":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
                    break;
            }
        } else {
            priceInitial = item.cartProduct[0]?.productSellingPrice ?? 0
        }

        return priceInitial * item.quantity >> 0
    }

    useEffect(() => {
        getUserCartitems((session?.user as { id: string }).id).then(res => {
            setCart(res.filter(it => it.cartProduct.length > 0))
            let subTotal = 0
            res.forEach(item => {
                subTotal = subTotal + calculateProductPrice(item)
            })
            setCartTotal(Number((subTotal * (userCurrency?.exchangeRates ?? 1)).toFixed(2)))
            setcartLoading(false)
        }).catch(e => console.log(e))
        getUserAddressList((session?.user as { id: string }).id).then(res => {
            setaddress(res)
            setAddrLoading(false)
        }).catch(e => console.log(e))
        // getShipping().then(res => SetShippingList(res))
    }, [userCurrency, currentTax])

    // const refreshCartItems = () => {
    //     setcartLoading(true)
    //     getUserCartitems((session?.user as { id: string }).id).then(res => {
    //         setCart(res)
    //         let subTotal = 0
    //         res.map((item, index) => {
    //             subTotal = subTotal + (item.cartProduct[0]?.productSellingPrice * item.quantity)
    //         })
    //         setCartTotal(subTotal)
    //         setcartLoading(false)
    //     }).catch(e => console.log(e))
    // }

    const processPayment = async () => {
        if (currentShipping == undefined) {
            onPageNotifications("info", "Select Shipping Address First.").catch(e => console.log(e))
            return
        }
        console.log(paymentMethod)
        switch (paymentMethod?.partner) {
            case "RZP":
                !razorPayOrder ? await generateRazorPayOrder(Math.round(orderTotal) * 100, "INR").then(response => {
                    if (response.ack) {
                        setRazorPayOrder(response.result.data)
                        launchRazorPayFlow(response.result.data)
                    } else {
                        onPageNotifications("error", "Something Went Wrong on Server.").catch(e => console.log(e))
                        onPageNotifications("error", "Please Try After Some Time.").catch(e => console.log(e))
                    }
                }) : launchRazorPayFlow(razorPayOrder)
                break;
            case "STRIPE":
                setShowStripe(true)
                break;
            case "PAYPAL":
                console.log(userCurrency)
                if (userCurrency?.currency == "USD") {
                    // setShowPayPal(true)
                    (document.getElementById("paypalModal") as HTMLDialogElement)?.showModal();
                    return
                }
                onPageNotifications("error", `PayPal Does Not Support ${userCurrency?.currency}`)
                break;
            default:
                onPageNotifications("info", "Select Payment Gateway First.").catch(e => console.log(e))
                return
        }
    }

    const handleCouponApply = () => {
        validateCoupon(couponCode, cartTotal).then(result => {
            setCouponData(result)
            if (result?.couponApplicable) {
                onPageNotifications("success", "Coupon Applied")
                switch (result.couponData.type) {
                    case 2:
                        setDeductable(result.couponData.value * (userCurrency?.exchangeRates ?? 1))
                        break;
                    case 1:
                        const tempDeductable = (cartTotal * (Number(result.couponData.value) / 100)) * (userCurrency?.exchangeRates ?? 1)
                        setDeductable(tempDeductable > Number(result.couponData.maxValue) * (userCurrency?.exchangeRates ?? 1) ? Number(result.couponData.maxValue) : tempDeductable)
                        break;
                }
            } else {
                onPageNotifications("error", "Copon Not Apllicable")
            }
        }).catch(err => onPageNotifications("error", "Something Went Wrong"))
    }

    useEffect(() => { setDeductable(0); setCouponCode("") }, [userCurrency])

    const paymentSuccessHandler = async (response: any) => {
        const paymentVerification = await verifyRazorpayPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature)
        console.log(paymentVerification)
        console.log(response)
        if (paymentVerification) {
            const orderData: OrderDataModel = {
                products: cart.map(({ cartProduct, quantity, variationCode, customSize }) => {
                    return {
                        productId: cartProduct[0]._id?.toString() ?? "",
                        productPrice: cartProduct[0].productSellingPrice,
                        productMSRP: cartProduct[0].productMSRP,
                        quantity: quantity,
                        variation: variationCode ?? "",
                        customSize
                    }
                }),
                shippingType: "Standard",
                shippingAddress: selectedAddress?._id ?? "",
                paymentStatus: "success",
                paymentMode: "Razorpay",
                couponApplied: couponData?.couponApplicable ? couponData.couponData : null,
                paymentCode: response.razorpay_payment_id,
                subtotal: Number(cartTotal),
                taxation: Number(cartTotal * (currentTax.taxRate / 100)),
                // taxation: 0,
                orderValue: orderTotal,
                userCurrency: { ...userCurrency },
                userId: (session?.user as { id: string }).id,
                _id: "",
                orderPlacedOn: 0,
                orderStatus: "placed",
                tracking: {
                    trackingNum: "",
                    type: ""
                }
            }
            saveOrderAfterPay(orderData).then(res => {
                if (res.ack) {
                    onPageNotifications("success", "Order Placed").catch(err => {
                        console.log(err)
                    })
                    router.push(`/order/final?order=${res.result.data}`)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const launchRazorPayFlow = (result: Orders.RazorpayOrder | undefined) => {
        const options = {
            key: paymentMethod?.key_id, // Enter the Key ID generated from the Dashboard
            amount: orderTotal, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: userCurrency?.currency,
            name: siteInfo.title,
            description: "New Order",
            image: siteInfo.logoSrc,
            order_id: result?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: paymentSuccessHandler,
            prefill: {
                name: session?.user?.name,
                email: session?.user?.email
            },
            theme: {
                color: "#954a2b"
            }
        }
        //@ts-ignore
        result && new Razorpay(options).open()
    }

    useEffect(() => {
        cartCount && cartCount == 0 && router.push("/")
    }, [cartCount])

    const stripeVerifyAndFinalize = async () => {

        if (queryParams.redirect_status == "succeeded" && cart.length > 0 && calledStripeFinal == 0) {
            ++calledStripeFinal
            const orderData: OrderDataModel = {
                products: cart.map(({ cartProduct, quantity, variationCode, customSize }) => {
                    return {
                        productId: cartProduct[0]._id?.toString() ?? "",
                        productPrice: cartProduct[0].productSellingPrice,
                        productMSRP: cartProduct[0].productMSRP,
                        quantity: quantity,
                        variation: variationCode ?? "",
                        customSize
                    }
                }),
                shippingType: "Standard",
                shippingAddress: queryParams.shippingId?.toString() ?? "",
                paymentStatus: "pending",
                paymentMode: "Stripe",
                couponApplied: couponData?.couponApplicable ? couponData.couponData : null,
                paymentCode: queryParams.payment_intent?.toString() ?? "",
                subtotal: Number(cartTotal),
                taxation: Number(cartTotal * (currentTax.taxRate / 100)),
                // taxation: 0,
                orderValue: orderTotal,
                userCurrency: { ...userCurrency },
                userId: (session?.user as { id: string }).id,
                _id: "",
                orderPlacedOn: 0,
                orderStatus: "placed",
                tracking: {
                    trackingNum: "",
                    type: ""
                }
            }
            saveOrderAfterPay(orderData).then(res => {
                if (res.ack) {
                    onPageNotifications("success", "Order Placed").catch(err => {
                        console.log(res)
                    })
                    router.push(`/order/final?order=${res.result.data}`)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    useEffect(() => {
        stripeVerifyAndFinalize()
    }, [cart])

    useEffect(() => {
        stripeKey && setStripePromise(loadStripe(stripeKey))
    }, [stripeKey])

    useEffect(() => {
        stripePromise && orderTotal && orderTotal > 0 && generateStripePaymentIntent(orderTotal, userCurrency?.currency ?? "").then(result => { setStripeClientSecret(result) }).catch(e => console.log(e))
    }, [stripePromise, orderTotal, userCurrency])

    useEffect(() => {
        if (addresses.length > 0) {
            setSelectedAddress(addresses[0])
        }
    }, [addresses])

    return (
        !Array.isArray(queryParams?.redirect_status) && stringEmptyOrNull(queryParams?.redirect_status) ? <>
            <div className="container py-0 sm:py-10 mx-auto">
                <div className="flex flex-col md:flex-row items-start">
                    <div className='flex flex-col lg:basis-2/3 w-full px-8 md:px-0 md:pl-5'>
                        <div className="text-lg font-bold w-full border-b pb-3 mb-10 mt-8 sm:mt-0">Delivery Address</div>
                        {
                            addressLoading && <div className="h-20 flex items-center justify-center w-full"><span className="loading loading-dots loading-lg"></span></div>
                        }
                        {
                            addresses.length > 0 && !addAddress && <>
                                <ShippingSelector addresses={addresses} selectedAddress={selectedAddress} selectionHandler={setSelectedAddress} />
                                <div className="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none justify-between bg-white mt-2" onClick={_ => setAddAddress(true)}>
                                    <span>New Address</span> <BsPlus className="w-7 h-7" />
                                </div>
                            </>
                        }
                        {
                            (!addAddress && addresses.length == 0 && !addressLoading) && <div className="bg-white relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none justify-between" onClick={_ => setAddAddress(true)}>
                                <span>New Address</span> <BsPlus className="w-7 h-7" />
                            </div>
                        }
                        {
                            addAddress && <UserAddressForm addAddressHandler={setAddAddress} />
                        }
                        <div className="text-lg font-bold w-full border-b pb-3 mb-10 mt-8">Payment Options</div>
                        {
                            pg && <PayMethodItem pgList={pg} selected={paymentMethod} setSelected={setPaymentMethod} currency={userCurrency} />
                        }
                        <div className="text-lg font-bold w-full border-b pb-3 mb-10 mt-8">Review Order Items</div>
                        {
                            cart?.map(item => <CartItemClient item={item} key={item._id} userCurrency={userCurrency} />)
                        }
                    </div>
                    <div className="px-10 py-10 lg:basis-1/3 hidden md:block sticky bottom-0 top-[170px]">
                        <div id="summary" className=" flex flex-col justify-between bg-gray-200 px-8 pt-10 pb-16 sm:pb-10">
                            <h1 className="font-semibold text-2xl border-b border-black pb-8">Order Summary</h1>
                            <div className="flex justify-between mt-10 mb-5">
                                <span className="font-semibold text-sm uppercase">Items {cart.length}</span>
                                <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {cartTotal}</span>
                            </div>
                            <div>
                                <label className="font-medium inline-block mb-3 text-sm uppercase">
                                    Shipping
                                </label>
                                <select className="block p-2 select select-bordered text-gray-600 w-full text-sm" id="shipping_mode_preference">
                                    {
                                        !selectedAddress && <option disabled>Select Your Address First</option>
                                    }
                                    {
                                        selectedAddress && <option>{(currentShipping) ? `Standard shipping - ${currentShipping.shippingCharges}` : "Sorry Delivery Not Supported"}</option>
                                    }
                                </select>
                            </div>
                            <div className={`py-10 ${couponData?.couponApplicable ? 'border-success' : 'border-error'}`}>
                                <label
                                    htmlFor="promo"
                                    className="font-semibold inline-block mb-3 text-sm uppercase"
                                >
                                    Promo Code
                                </label>
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        id="promo"
                                        placeholder="Enter your code"
                                        className={clsx("input input-bordered w-full join-item", { "border-success": couponData?.couponApplicable }, { "border-error": couponData?.couponApplicable == false })}
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                    />

                                    <button className="btn btn-active join-item" onClick={e => handleCouponApply()}>
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-black mt-8">
                                <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                    <span>Sub Total</span>
                                    <span>{userCurrency?.currencySymbol} {cartTotal}</span>
                                </div>
                                <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                    <span>Delivery</span>
                                    <span>{currentShipping && Number(currentShipping.shippingCharges.split(' ')[1]) > 0 ? currentShipping.shippingCharges : "Free"}</span>
                                </div>
                                {
                                    <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                        <span>Taxation</span>
                                        <span>{(cartTotal * (currentTax.taxRate / 100)).toFixed(2)}</span>
                                    </div>
                                }
                                {
                                    couponData?.couponApplicable && <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                        <span>Coupon Applied</span>
                                        <span>{userCurrency?.currencySymbol} {deductable.toFixed(2)}</span>
                                    </div>
                                }
                                <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                    <span>Total cost</span>
                                    <span>{userCurrency?.currencySymbol} {orderTotal.toFixed(2)}</span>
                                </div>
                                <button onClick={() => { processPayment() }} className={clsx("btn btn-primary w-full", (currentShipping) ? '' : 'btn-disabled')}>
                                    Pay
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='sm:px-10 py-10 md:hidden w-full'>
                        <div id="summary" className=" flex flex-col justify-between bg-gray-200 px-8 pt-10 pb-16 sm:pb-10">
                            <h1 className="font-semibold text-2xl border-b border-black pb-8">Order Summary</h1>
                            <div className="flex justify-between mt-10 mb-5">
                                <span className="font-semibold text-sm uppercase">Items {cart.length}</span>
                                <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {cartTotal}</span>
                            </div>
                            <div>
                                <label className="font-medium inline-block mb-3 text-sm uppercase">
                                    Shipping
                                </label>
                                <select className="block p-2 select select-bordered text-gray-600 w-full text-sm" id="shipping_mode_preference">
                                    {
                                        !selectedAddress && <option disabled>Select Your Address First</option>
                                    }
                                    {
                                        selectedAddress && <option>{(currentShipping) ? `Standard shipping - ${currentShipping.shippingCharges}` : "Sorry Delivery Not Supported"}</option>
                                    }
                                </select>
                            </div>
                            <div className="py-10">
                                <label
                                    htmlFor="promo"
                                    className="font-semibold inline-block mb-3 text-sm uppercase"
                                >
                                    Promo Code
                                </label>
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        id="promo"
                                        placeholder="Enter your code"
                                        className="input input-bordered w-full join-item"
                                    />

                                    <button className="btn btn-active join-item">
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-black mt-8">
                                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                    <span>Sub Total</span>
                                    <span>{userCurrency?.currencySymbol} {cartTotal}</span>
                                </div>
                                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                    <span>Delivery</span>
                                    <span>{currentShipping && Number(currentShipping.shippingCharges.split(' ')[1]) > 0 ? currentShipping.shippingCharges : "Free"}</span>
                                </div>
                                {
                                    <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                        <span>Taxation</span>
                                        <span>{userCurrency?.currencySymbol} {cartTotal * (currentTax.taxRate / 100)}</span>
                                    </div>
                                }
                                {
                                    couponData?.couponApplicable && <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                        <span>Coupon Applied</span>
                                        <span>{userCurrency?.currencySymbol} {deductable.toFixed(2)}</span>
                                    </div>
                                }
                                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                    <span>Total cost</span>
                                    <span>{userCurrency?.currencySymbol} {orderTotal.toFixed(2)}</span>
                                </div>
                                <button onClick={() => { processPayment() }} className={clsx("btn btn-primary w-full", { "sm:btn-disabled": payEnabled })} >
                                    Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Transition appear show={showStripe} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={(e: any) => setShowStripe(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                                    <GrFormClose className="absolute top-3 right-3 h-7 w-7 text-gray-500" onClick={_ => { setShowStripe(false) }} />
                                    {
                                        stripeClientSecret && paymentMethod?.partner == "STRIPE" && stripePromise != null && <Elements options={{
                                            clientSecret: stripeClientSecret ?? "",
                                            appearance: {
                                                theme: 'stripe',
                                                variables: {
                                                    colorPrimary: '#773b22',
                                                    colorText: '#000000',
                                                }
                                            },
                                        }} stripe={stripePromise}>
                                            <CheckoutForm clientSecret={stripeClientSecret} shippingId={selectedAddress?._id ?? ""} />
                                        </Elements>
                                    }

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* <Transition appear show={showPayPal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={(e: any) => setShowPayPal(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                                    <GrFormClose className="absolute top-3 right-3 h-7 w-7 text-gray-500 cursor-pointer" onClick={_ => { setShowPayPal(false) }} />
                                    {

                                    }
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition> */}
            <dialog id="paypalModal" className="modal">
                <div className="modal-box">
                    {orderTotal > 0 && selectedAddress?._id &&
                        <PayPalButtons
                            style={{
                                color: "blue"
                            }}
                            createOrder={() => {
                                return createOrder(`${orderTotal}`, userCurrency?.currency ?? "USD")
                            }}
                            onApprove={async (data: any, actions: any) => {
                                capturePayment(data.orderID).then(value => {
                                    if (value.status == "COMPLETED") {
                                        const orderData: OrderDataModel = {
                                            products: cart.map(({ cartProduct, quantity, variationCode, customSize }) => {
                                                return {
                                                    productId: cartProduct[0]._id?.toString() ?? "",
                                                    productPrice: cartProduct[0].productSellingPrice,
                                                    productMSRP: cartProduct[0].productMSRP,
                                                    quantity: quantity,
                                                    variation: variationCode ?? "",
                                                    customSize
                                                }
                                            }),
                                            shippingType: "Standard",
                                            shippingAddress: selectedAddress?._id ?? "",
                                            paymentStatus: "success",
                                            paymentMode: "PayPal",
                                            couponApplied: couponData?.couponApplicable ? couponData?.couponData : null,
                                            paymentCode: value.purchase_units[0].payments.captures[0].id,
                                            subtotal: Number(cartTotal),
                                            taxation: Number(cartTotal * (currentTax.taxRate / 100)),
                                            orderValue: orderTotal,
                                            userCurrency: { ...userCurrency },
                                            userId: (session?.user as { id: string }).id,
                                            _id: "",
                                            orderPlacedOn: 0,
                                            orderStatus: "placed",
                                            tracking: {
                                                trackingNum: "",
                                                type: ""
                                            }
                                        }
                                        saveOrderAfterPay(orderData).then(res => {
                                            if (res.ack) {
                                                onPageNotifications("success", "Order Placed").catch(err => {
                                                    console.log(err)
                                                })
                                                router.push(`/order/final?order=${res.result.data}`)
                                            }
                                        }).catch(err => {
                                            console.log(err)
                                        })
                                    }
                                })
                            }}
                        />
                    }
                </div>
            </dialog>
        </> : <Loader />
    )
}

export default MainSection