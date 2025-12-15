import React from 'react'
import PrintButton from './PrintButton'
import { OrderProduct } from '@/types/OrderDataModel'
import { ProductDataModel } from '@/types/ProductDataModel'
import getSiteData from '@/backend/serverActions/getSiteData'
import getOrderDetails from '@/backend/serverActions/getOrderDetails'

function getCustomSizePrice(item: OrderProduct, productPriceSqFt: number, quantity: number = 1) {
    switch (item.customSize?.shape) {
        case "Rectangle":
        case "Runner":
        case "Square":
            return productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
        case "Round":
            return productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
        default:
            return 0
    }
}

const calculateProductPrice = (orderProduct: OrderProduct, list: ProductDataModel[]): number => {
    return (orderProduct.variation ?
        orderProduct.variation != "customSize" ?
            parseInt(list.find(item => item._id == orderProduct.productId)?.variations[(list.find(item => item._id == orderProduct.productId)?.variations ?? []).findIndex(i => i.variationCode == orderProduct.variation)].variationPrice ?? '0')
            :
            getCustomSizePrice(orderProduct, list.find(item => item._id == orderProduct.productId)?.productPriceSqFt ?? 0, orderProduct.quantity)
        :
        orderProduct.productPrice) * orderProduct.quantity >> 0
}

function printprice(price: number, discountpercent: number, exchangerate: number, quantity: number = 1) {
    return ((price - (price * (discountpercent / 100))) * exchangerate) * quantity >> 0
}

export default async function Invoice({ params }: Readonly<{ params: { invoice: string } }>) {
    const siteData = await getSiteData()
    const orderData = await getOrderDetails(params.invoice)
    let deductable = 0
    let subTotal = 0
    let totalValue = 0
    orderData.products.forEach(item => {
        subTotal = subTotal + calculateProductPrice(item, orderData.productList)
    })
    totalValue = Number((subTotal * (orderData.userCurrency?.exchangeRates ?? 1)).toFixed(2))
    if (orderData?.couponApplied != null) {
        switch (orderData.couponApplied.type) {
            case 2:
                deductable = orderData.couponApplied.value * (orderData.userCurrency?.exchangeRates ?? 1)
                break;
            case 1:
                const tempDeductable = (orderData.orderValue * (Number(orderData.couponApplied.value) / 100)) * (orderData.userCurrency?.exchangeRates ?? 1)
                deductable = tempDeductable > Number(orderData.couponApplied.maxValue) * (orderData.userCurrency?.exchangeRates ?? 1) ? Number(orderData.couponApplied.maxValue) : tempDeductable
                break;
        }
    }

    return (
        <>
            <PrintButton className='print:hidden fixed top-20 right-6 z-50 btn btn-primary shadow-lg' />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 print:min-h-0 print:bg-white print:p-0" id='printableArea'>
                <div
                    className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden print:max-w-full print:shadow-none print:rounded-none"
                    id="invoice"
                >
                    {/* Header Section with Brand Identity */}
                    <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-8 print:bg-white print:border-b-4 print:border-black print:p-6">
                        <div className="flex justify-between items-start">
                            <div className="bg-white p-4 rounded-lg shadow-md print:p-0 print:shadow-none">
                                <img
                                    src={siteData.logoSrc}
                                    alt={siteData.title}
                                    height={120}
                                    width={120}
                                    className="object-contain print:h-20 print:w-20"
                                />
                            </div>
                            <div className="text-right text-white print:text-black">
                                <h1 className="text-3xl font-bold mb-2 print:text-2xl">INVOICE</h1>
                                <p className="text-lg opacity-90 print:text-base print:opacity-100">{siteData.title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Company & Customer Details */}
                    <div className="grid md:grid-cols-3 gap-6 p-8 bg-gray-50 print:bg-white print:gap-4 print:p-6 print:grid-cols-3">
                        {/* Company Info */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-700 print:shadow-none print:border print:border-black print:p-4">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 print:text-black">From</h2>
                            <p className="font-semibold text-gray-900 mb-2">{siteData.title}</p>
                            <p className="text-sm text-gray-800 leading-relaxed print:text-xs print:text-black">
                                {siteData.contact_details.flat_house}, {siteData.contact_details.address1}<br />
                                {siteData.contact_details.address2}<br />
                                {siteData.contact_details.state}, {siteData.contact_details.country}<br />
                                ZIP: {siteData.contact_details.PIN}
                            </p>
                            <p className="text-sm text-amber-800 font-medium mt-2 print:text-xs print:text-black">{siteData.contact_details.email}</p>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-600 print:shadow-none print:border print:border-black print:p-4">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 print:text-black">Bill To</h2>
                            <p className="font-semibold text-gray-900 mb-2">
                                {orderData.deliveryAddress.fname} {orderData.deliveryAddress.lname}
                            </p>
                            <p className="text-sm text-gray-800 leading-relaxed print:text-xs print:text-black">
                                {orderData.deliveryAddress.streetAddress}<br />
                                {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state}<br />
                                {orderData.deliveryAddress.country}<br />
                                PIN: {orderData.deliveryAddress.postalCode}
                            </p>
                            <p className="text-sm text-orange-700 font-medium mt-2 print:text-xs print:text-black">{orderData.user?.email}</p>
                        </div>

                        {/* Invoice Details */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-700 print:shadow-none print:border print:border-black print:p-4">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 print:text-black">Invoice Details</h2>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-700 print:text-black">Invoice Number</p>
                                    <p className="font-mono font-semibold text-gray-900 print:text-xs">{orderData._id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-700 print:text-black">Invoice Date</p>
                                    <p className="font-medium text-gray-900 print:text-xs">
                                        {Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(orderData.orderPlacedOn)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-700 print:text-black">Payment Method</p>
                                    <p className="font-medium text-gray-900 print:text-xs">{orderData.paymentMode}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items Table */}
                    <div className="p-8 print:p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300 print:border-2 print:border-black">
                                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white print:bg-gray-800">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider border-r border-gray-600 print:py-2 print:px-3 print:text-xs print:border-r print:border-black">
                                            Item Description
                                        </th>
                                        <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider border-r border-gray-600 print:py-2 print:px-2 print:text-xs print:border-r print:border-black">
                                            Qty
                                        </th>
                                        <th className="py-4 px-4 text-right text-sm font-semibold uppercase tracking-wider border-r border-gray-600 print:py-2 print:px-2 print:text-xs print:border-r print:border-black">
                                            Unit Price
                                        </th>
                                        <th className="py-4 px-6 text-right text-sm font-semibold uppercase tracking-wider print:py-2 print:px-3 print:text-xs">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 print:divide-y print:divide-black">
                                    {
                                        orderData.products.map((product, index) => {
                                            const productDetails = orderData.productList.find(item => item._id == product.productId)
                                            const variationIndex = productDetails?.variations?.findIndex(i => i.variationCode == product.variation)
                                            const variation = variationIndex !== undefined && variationIndex >= 0 ? productDetails?.variations[variationIndex] : null

                                            return (
                                                <tr key={product.productId} className="hover:bg-gray-50 transition-colors print:hover:bg-white">
                                                    <td className="py-4 px-6 border-r border-gray-200 print:py-2 print:px-3 print:border-r print:border-black">
                                                        <div className="font-semibold text-gray-900 print:text-xs print:text-black">{productDetails?.productName}</div>
                                                        {product.variation && product.variation != "customSize" && (
                                                            <div className="mt-1 text-sm text-gray-800 flex flex-wrap gap-2 print:text-[10px] print:gap-1 print:text-black">
                                                                {variation?.variationSize && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-800 print:bg-transparent print:text-black print:px-1 print:py-0">
                                                                        📏 {variation.variationSize}
                                                                    </span>
                                                                )}
                                                                {variation?.variationColor && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-800 print:bg-transparent print:text-black print:px-1 print:py-0">
                                                                        🎨 {variation.variationColor}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {product.customSize && (
                                                            <div className="mt-1 text-sm text-gray-800 print:text-[10px] print:text-black">
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-50 text-yellow-800 print:bg-transparent print:text-black print:px-0 print:py-0">
                                                                    ✂️ Custom: {product.customSize.shape}
                                                                    {product.customSize.dimensions.length && ` ${product.customSize.dimensions.length}×${product.customSize.dimensions.width}`}
                                                                    {product.customSize.dimensions.diameter && ` Ø${product.customSize.dimensions.diameter}`}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 text-center border-r border-gray-200 print:py-2 print:px-2 print:border-r print:border-black">
                                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-semibold text-gray-800 print:w-auto print:h-auto print:bg-transparent print:text-xs print:text-black">
                                                            {product.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-900 border-r border-gray-200 print:py-2 print:px-2 print:text-xs print:text-black print:border-r print:border-black">
                                                        {orderData.userCurrency.currencySymbol}
                                                        {
                                                            product.variation && product.variation != "customSize" && variation
                                                                ? printprice(
                                                                    parseInt(variation.variationPrice ?? '0'),
                                                                    parseInt(variation.variationDiscount ?? '0'),
                                                                    (orderData.userCurrency.exchangeRates ?? 1)
                                                                ).toLocaleString()
                                                                : product.variation == "customSize"
                                                                    ? getCustomSizePrice(product, productDetails?.productPriceSqFt ?? 0).toLocaleString()
                                                                    : (product.productPrice * (orderData.userCurrency.exchangeRates ?? 1)).toLocaleString()
                                                        }
                                                    </td>
                                                    <td className="py-4 px-6 text-right font-semibold text-gray-900 print:py-2 print:px-3 print:text-xs print:text-black">
                                                        {orderData.userCurrency.currencySymbol}
                                                        {
                                                            product.variation && product.variation != "customSize" && variation
                                                                ? (printprice(
                                                                    parseInt(variation.variationPrice ?? '0'),
                                                                    parseInt(variation.variationDiscount ?? '0'),
                                                                    (orderData.userCurrency.exchangeRates ?? 1)
                                                                ) * product.quantity).toLocaleString()
                                                                : product.variation == "customSize"
                                                                    ? getCustomSizePrice(product, productDetails?.productPriceSqFt ?? 0, product.quantity).toLocaleString()
                                                                    : (product.productPrice * product.quantity * (orderData.userCurrency.exchangeRates ?? 1)).toLocaleString()
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Section */}
                        <div className="mt-8 grid md:grid-cols-2 gap-8 print:mt-6 print:gap-4 print:grid-cols-2">
                            {/* QR Code Section */}
                            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 print:bg-white print:border print:border-black print:p-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(process.env.NEXTAUTH_URL + "/invoice/" + params.invoice)}`}
                                    alt="Invoice QR Code"
                                    height={150}
                                    width={150}
                                    className="rounded-lg shadow-md print:shadow-none print:h-24 print:w-24"
                                />
                                <p className='text-xs text-gray-800 mt-3 text-center font-medium print:text-[10px] print:mt-2 print:text-black'>
                                    📱 Scan to view invoice online
                                </p>
                            </div>

                            {/* Totals */}
                            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-300 print:bg-white print:p-4 print:border-black">
                                <div className="space-y-3 print:space-y-2">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-300 print:pb-2 print:text-xs print:border-black">
                                        <span className="text-gray-800 print:text-black">Subtotal</span>
                                        <span className="font-semibold text-gray-900 print:text-black">
                                            {orderData.userCurrency.currencySymbol} {orderData.orderValue.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pb-3 border-b border-gray-300 print:pb-2 print:text-xs print:border-black">
                                        <div>
                                            <span className="text-gray-800 print:text-black">Tax</span>
                                            {orderData.userCurrency.ISO == "IN" && (
                                                <span className="block text-xs text-gray-700 print:text-[10px] print:text-black">(CGST 2.5%, SGST 2.5%)</span>
                                            )}
                                        </div>
                                        <span className="font-semibold text-gray-900 print:text-black">
                                            {orderData.userCurrency.currencySymbol} {orderData.taxation.toLocaleString()}
                                        </span>
                                    </div>

                                    {orderData.couponApplied != null && (
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-300 print:pb-2 print:text-xs print:border-black">
                                            <div>
                                                <span className="text-green-600 print:text-black">Discount</span>
                                                <span className="block text-xs text-gray-700 print:text-[10px] print:text-black">({orderData.couponApplied.code})</span>
                                            </div>
                                            <span className="font-semibold text-green-600 print:text-black">
                                                -{orderData.userCurrency.currencySymbol} {deductable.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4 rounded-lg mt-4 print:bg-black print:text-white print:p-3 print:mt-2">
                                        <span className="text-lg font-bold print:text-sm">Total Amount</span>
                                        <span className="text-2xl font-bold print:text-lg">
                                            {orderData.userCurrency.currencySymbol} {(orderData.couponApplied ? (totalValue - deductable) : orderData.orderValue).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-800 text-white p-8 text-center print:bg-white print:text-black print:p-4 print:border-t-2 print:border-black">
                        <div className="max-w-2xl mx-auto space-y-2 print:space-y-1">
                            <p className="text-sm opacity-90 print:text-[10px] print:opacity-100 print:text-black">
                                ✓ This is an electronically generated invoice and no signature is required.
                            </p>
                            <p className="text-xs opacity-75 print:text-[10px] print:opacity-100 print:text-black">
                                This bill is subject to Jurisdiction of Jaipur, Rajasthan.
                            </p>
                            <div className="pt-4 border-t border-gray-700 mt-4 print:pt-2 print:mt-2 print:border-black">
                                <p className="text-xs opacity-60 print:text-[10px] print:opacity-100 print:text-black">
                                    Thank you for your business! For queries, contact: {siteData.contact_details.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
