// @ts-nocheck
'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo, useEffect, Fragment, useCallback, lazy, Suspense } from 'react'
import { BsPlus } from 'react-icons/bs'
import clsx from 'clsx'
import { Orders } from 'razorpay/dist/types/orders'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { GrFormClose } from 'react-icons/gr'
import { Elements } from '@stripe/react-stripe-js'
import { Session } from 'next-auth'
import UserAddressFormEnhanced from './UserAddressFormEnhanced'
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
import syncLocalCartToUser from '@/utils/syncLocalCartToUser'
import CartItem from '../CartItem'
import updateUserAddress from '@/backend/serverActions/updateUserAddress'
import deleteUserAddress from '@/backend/serverActions/deleteUserAddress'
import { initiatePayoneerPayment, cancelPayoneerOrder } from '@/backend/serverActions/payoneer'

// Lazy load heavy payment components
const LazyCheckoutForm = lazy(() => import('./Stripe/CheckoutForm'))
const LazyPayPalButtons = lazy(() => import('@paypal/react-paypal-js').then(mod => ({ default: mod.PayPalButtons })))

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
    const [addresses, setaddress] = useState<UserAddressDataModel[]>([])
    const [cartLoading, setcartLoading] = useState(true)
    const [addressLoading, setAddrLoading] = useState(true)
    const [razorPayOrder, setRazorPayOrder] = useState<Orders.RazorpayOrder>()
    const [couponCode, setCouponCode] = useState("")
    const [deductable, setDeductable] = useState(0)
    const [showStripe, setShowStripe] = useState(false)
    const [addAddress, setAddAddress] = useState(false)
    const [editingAddress, setEditingAddress] = useState<UserAddressDataModel | null>(null)
    const [selectedAddress, setSelectedAddress] = useState<UserAddressDataModel | null>(null)
    // const [taxation, setTaxation] = useState<TaxationDataModel[]>([])
    const [taxation, setTaxation] = useState<[]>([])
    const [pg] = useState<PaymentGatewayDataModel[]>(payOpts)
    const [couponData, setCouponData] = useState<{
        couponApplicable: boolean,
        couponData: CouponDataModel
    }>()
    const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayDataModel | null>()
    const [syncingLocalCart, setSyncingLocalCart] = useState(false)

    const currentTax = useMemo(() => {
        // return taxation.find(item => item.ISO === userCurrency?.ISO) ?? { taxRate: 0 }
        return userCurrency?.ISO == "IN" ? { taxRate: 5 } : { taxRate: 0 }
    }, [userCurrency, taxation])
    const currentShipping = selectedAddress && shippingList.filter((ship) => ship.country.toLowerCase() === selectedAddress.country.toLowerCase())[0]
    // const orderTotal = useMemo(() => {
    //     return Number(cartTotal + (currentShipping ? parseFloat(currentShipping.shippingCharges.split(' ')[1]) : 0)) - deductable
    // }, [currentTax, currentShipping, cartTotal, deductable])

    // Helper function to get individual item price (without quantity)
    const getItemUnitPrice = useCallback((item: CartDataModel): number => {
        var priceInitial = 0
        if (stringNotEmptyOrNull(item.variationCode) && item.variationCode != "customSize") {
            const variationindex = item.cartProduct[0].variations.findIndex(ff => ff.variationCode == item.variationCode!);
            const variationPrice = Number(item.cartProduct[0].variations[variationindex].variationPrice);
            const variationDiscount = Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationDiscount ?? 0);
            priceInitial = variationPrice - (variationPrice * (variationDiscount / 100));
        } else if (item.variationCode == "customSize") {
            switch (item.customSize?.shape) {
                case "Rectangle":
                case "Runner":
                case "Square":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1);
                    break;
                case "Round":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI);
                    break;
            }
        } else {
            priceInitial = item.cartProduct[0]?.productSellingPrice ?? 0;
        }
        return priceInitial
    }, [])

    // Memoize calculateProductPrice to avoid recalculating for same item
    const calculateProductPrice = useCallback((item: CartDataModel): number => {
        return getItemUnitPrice(item) * item.quantity
    }, [getItemUnitPrice])
    const orderTotal = useMemo(() => {
        return Number(cart.reduce((total, item) => {
            const itemPrice = calculateProductPrice(item)
            return total + itemPrice
        }, 0) + (currentShipping ? parseFloat(currentShipping.shippingCharges.split(' ')[1]) : 0)) + Number((cart.reduce((total, item) => {
            const itemPrice = calculateProductPrice(item)
            return total + itemPrice
        }, 0) * currentTax.taxRate / 100).toFixed(2)) - deductable
    }, [currentTax, currentShipping, cart, deductable])
    const payEnabled = useMemo(() => {
        return cartCount != 0 && paymentMethod && paymentMethod.partner != undefined && currentShipping != undefined
    }, [cartCount, paymentMethod, currentShipping])

    const isPayDisabled = useMemo(() => {
        // Disable if cart is empty, payment method not selected, or shipping not selected/available
        return (
            cartCount === 0 ||
            !paymentMethod ||
            !paymentMethod.partner ||
            !currentShipping ||
            !selectedAddress
        );
    }, [cartCount, paymentMethod, currentShipping, selectedAddress]);

    // Add a function to get the pay button disabled reason
    const getPayDisabledReason = () => {
        if (cartCount === 0) return "Your cart is empty.";
        if (!selectedAddress) return "Please select a delivery address.";
        if (!currentShipping) return "Delivery is not available for the selected address.";
        if (!paymentMethod || !paymentMethod.partner) return "Please select a payment method.";
        return "";
    };

    // Memoize cart total calculation
    const cartTotal = useMemo(() => {
        let subTotal = 0
        cart.forEach(item => {
            subTotal += calculateProductPrice(item)
        })
        return Number((subTotal * (userCurrency?.exchangeRates ?? 1)).toFixed(2))
    }, [cart, userCurrency, calculateProductPrice])

    // Batch state updates for cart and address
    useEffect(() => {
        let isMounted = true
        Promise.all([
            getUserCartitems((session?.user as { id: string }).id),
            getUserAddressList((session?.user as { id: string }).id)
        ]).then(([cartRes, addrRes]) => {
            if (!isMounted) return
            setCart(cartRes.filter(it => it.cartProduct.length > 0))
            setaddress(addrRes)
            setcartLoading(false)
            setAddrLoading(false)
        }).catch(e => console.log(e))
        return () => { isMounted = false }
    }, [userCurrency, currentTax])

    // Debounce coupon input
    const [debouncedCoupon, setDebouncedCoupon] = useState("")
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedCoupon(couponCode), 400)
        return () => clearTimeout(handler)
    }, [couponCode])
    // Only validate coupon when debouncedCoupon changes
    useEffect(() => {
        if (!debouncedCoupon) return
        validateCoupon(debouncedCoupon, cartTotal).then(result => {
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
    }, [debouncedCoupon, cartTotal, userCurrency])

    // Move launchRazorPayFlow above processPayment to avoid TDZ error
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

    // Memoize processPayment handler
    const processPayment = useCallback(async () => {
        if (currentShipping == undefined) {
            onPageNotifications("info", "Select Shipping Address First.").catch(e => console.log(e))
            return
        }
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
                if (userCurrency?.currency == "USD") {
                    (document.getElementById("paypalModal") as HTMLDialogElement)?.showModal();
                    return
                }
                onPageNotifications("error", `PayPal Does Not Support ${userCurrency?.currency}`)
                break;
            case "PAYONEER":
                // Build order data object
                const payoneerOrderData: OrderDataModel = {
                    products: cart.map((item) => {
                        const unitPrice = getItemUnitPrice(item)
                        return {
                            productId: item.cartProduct[0]._id?.toString() ?? "",
                            productPrice: unitPrice,
                            productMSRP: item.cartProduct[0].productMSRP,
                            quantity: item.quantity,
                            variation: item.variationCode ?? "",
                            customSize: item.customSize
                        }
                    }),
                    shippingType: currentShipping?.name || "Standard",
                    shippingAddress: selectedAddress?._id ?? "",
                    paymentStatus: "pending", // Will be updated by webhook
                    paymentMode: "Payoneer",
                    couponApplied: couponData?.couponApplicable ? couponData.couponData : null,
                    paymentCode: "", // Will be updated by webhook
                    subtotal: Number(cartTotal),
                    taxation: Number(cartTotal * (currentTax.taxRate / 100)),
                    orderValue: orderTotal,
                    userCurrency: { ...userCurrency! },
                    userId: (session?.user as { id: string }).id,
                    _id: "",
                    orderPlacedOn: 0,
                    orderStatus: "pending", // Will be updated by webhook
                    tracking: {
                        trackingNum: "",
                        type: ""
                    }
                }

                // Create order FIRST with pending status (before redirect)
                const payoneerOrderResult = await saveOrderAfterPay(payoneerOrderData)

                if (!payoneerOrderResult.ack) {
                    onPageNotifications("error", "Failed to create order")
                    return
                }

                const orderNumber = payoneerOrderResult.result.data

                // Store order number for callback page
                sessionStorage.setItem('payoneerOrderNumber', orderNumber)

                // Initiate Payoneer payment with the created order number
                const payoneerResult = await initiatePayoneerPayment({
                    orderId: orderNumber,
                    amount: orderTotal,
                    currency: userCurrency?.currency || 'USD',
                    customerEmail: session?.user?.email,
                    customerName: session?.user?.name,
                    shippingAddress: selectedAddress ? {
                        fname: selectedAddress.fname,
                        lname: selectedAddress.lname,
                        email: selectedAddress.email,
                        streetAddress: selectedAddress.streetAddress,
                        city: selectedAddress.city,
                        state: selectedAddress.state,
                        country: selectedAddress.country,
                        postalCode: selectedAddress.postalCode
                    } : undefined,
                    customerNumber: (session?.user as { id: string })?.id
                })

                if (payoneerResult.success && payoneerResult.redirectUrl) {
                    // Redirect to Payoneer payment page
                    console.log('✅ Order created:', orderNumber)
                    console.log('Redirecting to Payoneer:', payoneerResult.redirectUrl)
                    window.location.href = payoneerResult.redirectUrl
                } else {
                    // Payoneer service failed - cancel the created order
                    console.error('❌ Payoneer service failed, cancelling order:', orderNumber)
                    await cancelPayoneerOrder(orderNumber, payoneerResult.error || 'Payoneer service unavailable')
                    sessionStorage.removeItem('payoneerOrderNumber')
                    onPageNotifications("error", payoneerResult.error || "Failed to initiate Payoneer payment. Please try again or use a different payment method.")
                }
                break;
            default:
                onPageNotifications("info", "Select Payment Gateway First.").catch(e => console.log(e))
                return
        }
    }, [currentShipping, paymentMethod, razorPayOrder, orderTotal, userCurrency, launchRazorPayFlow])

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
    }    // Address management handlers
    const handleEditAddress = (address: UserAddressDataModel) => {
        setEditingAddress(address)
        setAddAddress(true)
    }

    const handleAddAddressToggle = (value: boolean) => {
        setAddAddress(value)
        if (!value) {
            setEditingAddress(null) // Clear editing state when closing form
        }
    }

    const handleDeleteAddress = async (addressId: string) => {
        try {
            if (!session?.user?.id) {
                onPageNotifications("error", "Please login to delete address")
                return
            }

            const result = await deleteUserAddress(addressId, (session.user as { id: string }).id)
            
            if (result.ack) {
                onPageNotifications("success", "Address deleted successfully")
                // Remove the deleted address from the local state
                setaddress(prevAddresses => prevAddresses.filter(addr => addr._id !== addressId))
                // If the deleted address was selected, clear the selection
                if (selectedAddress?._id === addressId) {
                    setSelectedAddress(null)
                }
            } else {
                onPageNotifications("error", "Failed to delete address")
            }
        } catch (error) {
            console.error('Error deleting address:', error)
            onPageNotifications("error", "Something went wrong while deleting address")
        }
    }

    const refreshAddressList = async () => {
        if (session?.user?.id) {
            try {
                const addressList = await getUserAddressList((session.user as { id: string }).id)
                setaddress(addressList)
            } catch (error) {
                console.error('Error refreshing address list:', error)
            }
        }
    }

    useEffect(() => { setDeductable(0); setCouponCode("") }, [userCurrency])

    const paymentSuccessHandler = async (response: any) => {
        const paymentVerification = await verifyRazorpayPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature)
        console.log(paymentVerification)
        console.log(response)
        if (paymentVerification) {
            const orderData: OrderDataModel = {
                products: cart.map((item) => {
                    const unitPrice = getItemUnitPrice(item)
                    return {
                        productId: item.cartProduct[0]._id?.toString() ?? "",
                        productPrice: unitPrice,
                        productMSRP: item.cartProduct[0].productMSRP,
                        quantity: item.quantity,
                        variation: item.variationCode ?? "",
                        customSize: item.customSize
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

    useEffect(() => {
        cartCount && cartCount == 0 && router.push("/")
    }, [cartCount])

    const stripeVerifyAndFinalize = async () => {

        if (queryParams.redirect_status == "succeeded" && cart.length > 0 && calledStripeFinal == 0) {
            ++calledStripeFinal
            const orderData: OrderDataModel = {
                products: cart.map((item) => {
                    const unitPrice = getItemUnitPrice(item)
                    return {
                        productId: item.cartProduct[0]._id?.toString() ?? "",
                        productPrice: unitPrice,
                        productMSRP: item.cartProduct[0].productMSRP,
                        quantity: item.quantity,
                        variation: item.variationCode ?? "",
                        customSize: item.customSize
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

    // Sync local cart to user cart on first mount if needed
    useEffect(() => {
        if (typeof window !== 'undefined' && session?.user?.id) {
            const localCartRaw = localStorage.getItem('pending_cart')
            if (localCartRaw) {
                setSyncingLocalCart(true)
                syncLocalCartToUser(session.user.id, async (userId: string, productId: string, quantity: number, variationCode: string, onSuccess?: () => void, onError?: (err: any) => void) => {
                    try {
                        const res = await fetch('/api/user/addtocart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId, userId, quantity, variationCode })
                        });
                        if (res.ok) {
                            if (onSuccess) onSuccess();
                        } else {
                            if (onError) onError(await res.text());
                        }
                    } catch (err) {
                        if (onError) onError(err);
                    }
                }).then(() => {
                    setSyncingLocalCart(false)
                    // Optionally, refresh cart after sync
                    getUserCartitems(session.user.id).then(cartRes => setCart(cartRes.filter(it => it.cartProduct.length > 0)))
                })
            }
        }
    }, [session?.user?.id])

    if (syncingLocalCart) {
        return <Loader />
    }

    return (
        !Array.isArray(queryParams?.redirect_status) && stringEmptyOrNull(queryParams?.redirect_status) ? <>
            <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100">
                <div className="container max-w-7xl py-6 sm:py-10 mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Checkout</h1>
                        <p className="text-base-content/60 mt-1">Complete your order securely</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content - Left Side */}
                        <div className="flex-1 space-y-6">
                            {/* Delivery Address Section */}
                            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-base-300/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">1</div>
                                        <h2 className="text-lg font-semibold text-base-content">Delivery Address</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {addressLoading && (
                                        <div className="h-24 flex items-center justify-center">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </div>
                                    )}
                                    {addresses.length > 0 && !addAddress && (
                                        <>
                                            <ShippingSelector 
                                                addresses={addresses} 
                                                selectedAddress={selectedAddress} 
                                                selectionHandler={setSelectedAddress}
                                                onEditAddress={handleEditAddress}
                                                onDeleteAddress={handleDeleteAddress}
                                            />
                                            <button 
                                                className="mt-4 w-full flex items-center justify-center gap-2 py-4 px-5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-medium transition-all duration-200" 
                                                onClick={_ => handleAddAddressToggle(true)}
                                            >
                                                <BsPlus className="w-6 h-6" />
                                                Add New Address
                                            </button>
                                        </>
                                    )}
                                    {!addAddress && addresses.length === 0 && !addressLoading && (
                                        <button 
                                            className="w-full flex items-center justify-center gap-2 py-6 px-5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-medium transition-all duration-200" 
                                            onClick={_ => handleAddAddressToggle(true)}
                                        >
                                            <BsPlus className="w-6 h-6" />
                                            Add New Address
                                        </button>
                                    )}
                                    {addAddress && (
                                        <UserAddressFormEnhanced 
                                            addAddressHandler={handleAddAddressToggle} 
                                            editingAddress={editingAddress}
                                            onSaveComplete={refreshAddressList}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Payment Options Section */}
                            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-base-300/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">2</div>
                                        <h2 className="text-lg font-semibold text-base-content">Payment Method</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {pg && <PayMethodItem pgList={pg} selected={paymentMethod} setSelected={setPaymentMethod} currency={userCurrency} />}
                                </div>
                            </div>

                            {/* Order Items Section */}
                            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-base-300/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">3</div>
                                            <h2 className="text-lg font-semibold text-base-content">Review Items</h2>
                                        </div>
                                        <span className="text-sm text-base-content/60">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {cartLoading ? (
                                        <div className="h-24 flex items-center justify-center">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </div>
                                    ) : (
                                        cart?.map(item => <CartItem item={item} key={item._id} userCurrency={userCurrency} />)
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Right Side (Desktop) */}
                        <div className="lg:w-[380px] hidden lg:block">
                            <div className="sticky top-[100px]">
                                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300/50 overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5">
                                        <h2 className="text-xl font-bold text-primary-content">Order Summary</h2>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {/* Items Count */}
                                        <div className="flex justify-between items-center text-base-content">
                                            <span className="text-base-content/70">Items ({cart.length})</span>
                                            <span className="font-medium">{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
                                        </div>

                                        {/* Shipping */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-base-content/70 uppercase tracking-wide">Shipping</label>
                                            <div className="bg-base-200/50 rounded-lg px-4 py-3 text-sm">
                                                {!selectedAddress ? (
                                                    <span className="text-base-content/50 italic">Select address first</span>
                                                ) : currentShipping ? (
                                                    <div className="flex justify-between items-center">
                                                        <span>Standard Delivery</span>
                                                        <span className="font-medium">
                                                            {Number(currentShipping.shippingCharges.split(' ')[1]) > 0 
                                                                ? currentShipping.shippingCharges 
                                                                : <span className="text-success">Free</span>}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-error text-xs">Delivery not available for this location</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Promo Code */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-base-content/70 uppercase tracking-wide">Promo Code</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter code"
                                                    className={clsx(
                                                        "input input-bordered flex-1 bg-base-200/50 focus:bg-base-100",
                                                        couponData?.couponApplicable && "border-success",
                                                        couponData?.couponApplicable === false && "border-error"
                                                    )}
                                                    value={couponCode}
                                                    onChange={e => setCouponCode(e.target.value)}
                                                />
                                                <button 
                                                    className="btn btn-primary px-6"
                                                    onClick={handleCouponApply}
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {couponData?.couponApplicable && (
                                                <p className="text-success text-xs flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                                    Coupon applied successfully!
                                                </p>
                                            )}
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-base-300 my-2"></div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between text-base-content/70">
                                                <span>Subtotal</span>
                                                <span>{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-base-content/70">
                                                <span>Delivery</span>
                                                <span>{currentShipping && Number(currentShipping.shippingCharges.split(' ')[1]) > 0 ? currentShipping.shippingCharges : "Free"}</span>
                                            </div>
                                            {currentTax.taxRate > 0 && (
                                                <div className="flex justify-between text-base-content/70">
                                                    <span>Tax ({currentTax.taxRate}%)</span>
                                                    <span>{userCurrency?.currencySymbol} {(cartTotal * (currentTax.taxRate / 100)).toFixed(2)}</span>
                                                </div>
                                            )}
                                            {couponData?.couponApplicable && (
                                                <div className="flex justify-between text-success">
                                                    <span>Discount</span>
                                                    <span>- {userCurrency?.currencySymbol} {deductable.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-base-300 my-2"></div>

                                        {/* Total */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-base-content">Total</span>
                                            <span className="text-2xl font-bold text-primary">{userCurrency?.currencySymbol} {orderTotal.toFixed(2)}</span>
                                        </div>

                                        {/* Pay Button */}
                                        <button 
                                            onClick={processPayment} 
                                            className={clsx(
                                                "btn btn-primary w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200",
                                                isPayDisabled && "btn-disabled opacity-50"
                                            )} 
                                            disabled={isPayDisabled}
                                        >
                                            {isPayDisabled ? "Complete All Steps" : `Pay ${userCurrency?.currencySymbol} ${orderTotal.toFixed(2)}`}
                                        </button>
                                        {isPayDisabled && (
                                            <p className="text-xs text-center text-error mt-2">{getPayDisabledReason()}</p>
                                        )}

                                        {/* Security Badge */}
                                        <div className="flex items-center justify-center gap-2 text-xs text-base-content/50 mt-4">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                                            <span>Secure SSL Encrypted Payment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Mobile (Bottom Sheet Style) */}
                        <div className="lg:hidden">
                            <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                                    <h2 className="text-lg font-bold text-primary-content">Order Summary</h2>
                                </div>
                                <div className="p-5 space-y-4">
                                    {/* Items Count */}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-base-content/70">Items ({cart.length})</span>
                                        <span className="font-medium">{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="bg-base-200/50 rounded-lg px-4 py-3 text-sm">
                                        {!selectedAddress ? (
                                            <span className="text-base-content/50 italic">Select address first</span>
                                        ) : currentShipping ? (
                                            <div className="flex justify-between items-center">
                                                <span>Shipping</span>
                                                <span className="font-medium">
                                                    {Number(currentShipping.shippingCharges.split(' ')[1]) > 0 
                                                        ? currentShipping.shippingCharges 
                                                        : <span className="text-success">Free</span>}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-error text-xs">Delivery not available</span>
                                        )}
                                    </div>

                                    {/* Promo Code */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Promo code"
                                            className={clsx(
                                                "input input-bordered input-sm flex-1 bg-base-200/50",
                                                couponData?.couponApplicable && "border-success",
                                                couponData?.couponApplicable === false && "border-error"
                                            )}
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value)}
                                        />
                                        <button className="btn btn-primary btn-sm" onClick={handleCouponApply}>Apply</button>
                                    </div>

                                    <div className="border-t border-base-300 pt-3 space-y-2 text-sm">
                                        <div className="flex justify-between text-base-content/70">
                                            <span>Subtotal</span>
                                            <span>{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-base-content/70">
                                            <span>Delivery</span>
                                            <span>{currentShipping && Number(currentShipping.shippingCharges.split(' ')[1]) > 0 ? currentShipping.shippingCharges : "Free"}</span>
                                        </div>
                                        {currentTax.taxRate > 0 && (
                                            <div className="flex justify-between text-base-content/70">
                                                <span>Tax</span>
                                                <span>{userCurrency?.currencySymbol} {(cartTotal * (currentTax.taxRate / 100)).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {couponData?.couponApplicable && (
                                            <div className="flex justify-between text-success">
                                                <span>Discount</span>
                                                <span>- {userCurrency?.currencySymbol} {deductable.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Total & Pay */}
                                    <div className="border-t border-base-300 pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-base-content">Total</span>
                                            <span className="text-xl font-bold text-primary">{userCurrency?.currencySymbol} {orderTotal.toFixed(2)}</span>
                                        </div>
                                        <button 
                                            onClick={processPayment} 
                                            className={clsx("btn btn-primary w-full", isPayDisabled && "btn-disabled")} 
                                            disabled={isPayDisabled}
                                        >
                                            {isPayDisabled ? "Complete All Steps" : "Pay Now"}
                                        </button>
                                        {isPayDisabled && (
                                            <p className="text-xs text-center text-error mt-2">{getPayDisabledReason()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <dialog id="paypalModal" className="modal">
                <div className="modal-box">
                    {orderTotal > 0 && selectedAddress?._id &&
                        <Suspense fallback={<div>Loading PayPal...</div>}>
                            <LazyPayPalButtons
                                style={{ color: "blue" }}
                                createOrder={() => createOrder(`${orderTotal.toFixed(2)}`, userCurrency?.currency ?? "USD")}
                                onApprove={async (data: any, actions: any) => {
                                    capturePayment(data.orderID).then(value => {
                                        if (value.status == "COMPLETED") {
                                            const orderData: OrderDataModel = {
                                                products: cart.map((item) => {
                                                    const unitPrice = getItemUnitPrice(item)
                                                    return {
                                                        productId: item.cartProduct[0]._id?.toString() ?? "",
                                                        productPrice: unitPrice,
                                                        productMSRP: item.cartProduct[0].productMSRP,
                                                        quantity: item.quantity,
                                                        variation: item.variationCode ?? "",
                                                        customSize: item.customSize
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
                                                orderValue: orderTotal.toFixed(2),
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
                        </Suspense>
                    }
                </div>
            </dialog>
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
                                <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-base-100 p-7 text-left align-middle shadow-xl transition-all">
                                    <GrFormClose className="absolute top-3 right-3 h-7 w-7 text-gray-500" onClick={_ => { setShowStripe(false) }} />
                                    {stripeClientSecret && paymentMethod?.partner == "STRIPE" && stripePromise != null &&
                                        <Suspense fallback={<div>Loading Stripe...</div>}>
                                            <Elements options={{
                                                clientSecret: stripeClientSecret ?? "",
                                                appearance: {
                                                    theme: 'stripe',
                                                    variables: {
                                                        colorPrimary: '#773b22',
                                                        colorText: '#000000',
                                                    }
                                                },
                                            }} stripe={stripePromise}>
                                                <LazyCheckoutForm clientSecret={stripeClientSecret} shippingId={selectedAddress?._id ?? ""} />
                                            </Elements>
                                        </Suspense>
                                    }
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </> : <Loader />
    )
}

export default MainSection