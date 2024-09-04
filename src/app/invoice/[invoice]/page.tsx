import React from 'react'
import PrintButton from './PrintButton'
import getSiteData from '@/lib/actions/getSiteData'
import getOrdersDetails from '@/lib/actions/getOrderDetails'
import { OrderProduct } from '@/lib/types/OrderDataModel'
import { ProductDataModel } from '@/lib/types/ProductDataModel'

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
    const orderData = await getOrdersDetails(params.invoice)
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
            <PrintButton className='print:hidden mx-auto flex btn' />
            <div
                className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6"
                id="invoice"
            >
                <div className="grid grid-cols-2 items-center">
                    <div>
                        {/*  Company logo  */}
                        <img
                            src={siteData.logoSrc}
                            alt={siteData.title}
                            height={200}
                            width={200}
                        />
                    </div>
                    <div className="text-right">
                        <p>{siteData.title}</p>
                        <p className="text-sm">{siteData.contact_details.email}</p>
                        <p className="text-sm mt-1">{siteData.contact_details.flat_house}, {siteData.contact_details.address1},</p>
                        <p className="text-sm mt-1">{siteData.contact_details.address2}, {siteData.contact_details.state}, {siteData.contact_details.country} ZIP: {siteData.contact_details.PIN}</p>
                        <p className="text-sm mt-1"></p>
                        {/* <p className="text-sm mt-1">VAT: 8657671212</p> */}
                    </div>
                </div>
                {/* Client info */}
                <div className="grid grid-cols-2 items-center mt-8">
                    <div>
                        <p className="font-bold text-gray-800">Bill to :</p>
                        <p className="text-sm">
                            {orderData.deliveryAddress.fname} {orderData.deliveryAddress.lname}
                            <br />
                            {orderData.deliveryAddress.streetAddress},
                            {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state},
                            {orderData.deliveryAddress.country}, PIN-{orderData.deliveryAddress.postalCode}
                        </p>
                        <p className="text-sm">{orderData.user?.email}</p>
                    </div>
                    <div className="text-right text-sm">
                        <p className="">
                            <span className='font-bold'>Order/Invoice number:</span> {orderData._id}
                        </p>
                        <p>
                            <span className='font-bold'>Invoice date:</span> {Intl.DateTimeFormat("en-IN", { timeStyle: "medium", dateStyle: "long" }).format(orderData.orderPlacedOn)}
                        </p>
                    </div>
                </div>
                {/* Invoice Items */}
                <div className="-mx-4 mt-8 flow-root sm:mx-0">
                    <table className="min-w-full">
                        <colgroup>
                            <col className="w-full sm:w-1/2" />
                            <col className="sm:w-1/6" />
                            <col className="sm:w-1/6" />
                            <col className="sm:w-1/6" />
                        </colgroup>
                        <thead className="border-b border-gray-300 text-gray-900">
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                >
                                    Items
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                                >
                                    Quantity
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                                >
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                                >
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderData.products.map((product, index) => <tr key={product.productId} className="border-b border-gray-200">
                                    <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="font-medium text-gray-900">{orderData.productList.find(item => item._id == product.productId)?.productName}</div>
                                        <div className="mt-1 truncate text-gray-500">
                                            {product.variation && product.variation != "customSize" && orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationSize && `Size :${orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationSize}`}  {product.variation && product.variation != "customSize" && orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationColor && `Color :${orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationColor}`}
                                        </div>
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-sm sm:table-cell">
                                        {product.quantity}
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-sm sm:table-cell">
                                        {orderData.userCurrency.currencySymbol}&nbsp;
                                        {
                                            product.variation && product.variation != "customSize" && printprice(parseInt(orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationPrice ?? '0'), parseInt(orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationDiscount ?? '0'), (orderData.userCurrency.exchangeRates ?? 1))
                                        }
                                        {
                                            product.variation && product.variation == "customSize" && getCustomSizePrice(orderData.products.find(item => item.productId == product.productId)!, orderData.productList.find(item => item._id == orderData.products.find(item => item.productId == product.productId)!.productId)?.productPriceSqFt ?? 0)
                                        }
                                    </td>
                                    <td className="py-5 pl-3 pr-4 text-right text-sm sm:pr-0">
                                        {orderData.userCurrency.currencySymbol}&nbsp;
                                        {
                                            product.variation && product.variation != "customSize" && printprice(parseInt(orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationPrice ?? '0'), parseInt(orderData.productList.find(item => item._id == product.productId)?.variations[(orderData.productList.find(item => item._id == product.productId)?.variations ?? []).findIndex(i => i.variationCode == product.variation)].variationDiscount ?? '0'), (orderData.userCurrency.exchangeRates ?? 1))
                                        }
                                        {
                                            product.variation && product.variation == "customSize" && getCustomSizePrice(orderData.products.find(item => item.productId == product.productId)!, orderData.productList.find(item => item._id == orderData.products.find(item => item.productId == product.productId)!.productId)?.productPriceSqFt ?? 0, orderData.products.find(item => item.productId == product.productId)!.quantity)
                                        }
                                    </td>
                                </tr>)
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2} rowSpan={orderData.couponApplied != null ? 4 : 3}>
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(process.env.NEXTAUTH_URL + "/invoice/" + params.invoice)}`} alt="" height={100} width={100} />
                                    <span className='text-xs'>Scan the QR code to view the invoice online.</span>
                                </td>
                                <th
                                    scope="row"
                                    className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal sm:table-cell sm:pl-0"
                                >
                                    Subtotal
                                </th>
                                <th
                                    scope="row"
                                    className="pl-6 pr-3 pt-6 text-left text-sm font-normal sm:hidden"
                                >
                                    Subtotal
                                </th>
                                <td className="pl-3 pr-6 pt-6 text-right text-sm sm:pr-0">
                                    {orderData.userCurrency.currencySymbol} {orderData.orderValue}
                                </td>
                            </tr>
                            <tr>
                                <th
                                    scope="row"
                                    // colSpan={3}
                                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal sm:table-cell sm:pl-0"
                                >
                                    Tax<br />
                                    <span className='text-[11px]'>{orderData.userCurrency.ISO == "IN" && "(CGST 2.5%, SGST 2.5%)"}</span>
                                </th>
                                <th
                                    scope="row"
                                    className="pl-6 pr-3 pt-4 text-left text-sm font-normal sm:hidden"
                                >
                                    Tax<br />
                                    <span className='text-[11px]'>{orderData.userCurrency.ISO == "IN" && "(CGST 2.5%, SGST 2.5%)"}</span>
                                </th>
                                <td className="pl-3 pr-6 pt-4 text-right text-sm sm:pr-0">
                                    {orderData.userCurrency.currencySymbol} {orderData.taxation}
                                </td>
                            </tr>
                            {
                                orderData.couponApplied != null ? <> <tr>
                                    <th
                                        scope="row"
                                        // colSpan={3}
                                        className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal sm:table-cell sm:pl-0"
                                    >
                                        Discount({orderData.couponApplied?.code})
                                    </th>
                                    <th
                                        scope="row"
                                        className="pl-6 pr-3 pt-4 text-left text-sm font-normal sm:hidden"
                                    >
                                        Discount({orderData.couponApplied?.code})
                                    </th>
                                    <td className="pl-3 pr-6 pt-4 text-right text-sm sm:pr-0">
                                        -{orderData.userCurrency.currencySymbol} {deductable}
                                    </td>
                                </tr>
                                    <tr>
                                        <th
                                            scope="row"
                                            // colSpan={3}
                                            className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                                        >
                                            Total
                                        </th>
                                        <th
                                            scope="row"
                                            className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                                        >
                                            Total
                                        </th>
                                        <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                                            {orderData.userCurrency.currencySymbol} {totalValue - deductable}
                                        </td>
                                    </tr>
                                </> : <tr>
                                    <th
                                        scope="row"
                                        // colSpan={3}
                                        className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                                    >
                                        Total
                                    </th>
                                    <th
                                        scope="row"
                                        className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                                    >
                                        Total
                                    </th>
                                    <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                                        {orderData.userCurrency.currencySymbol} {orderData.orderValue}
                                    </td>
                                </tr>
                            }
                        </tfoot>
                    </table>
                </div>
                {/*  Footer  */}
                <div className="border-t-2 pt-4 text-xs text-center mt-16">
                    This is an eltronically generated invoice and no signature is required.
                </div>
                <div className="pt-4 text-xs text-center">
                    This bill is subject to Jurisdiction of Jaipur, Rajasthan.
                </div>
            </div>
        </>
    )
}
