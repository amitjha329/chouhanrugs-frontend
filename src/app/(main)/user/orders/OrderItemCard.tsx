import Link from "next/link"
import OrderDataModel from "@/types/OrderDataModel"
import OrderTrackingProgressbar from "./OrderTrackingProgressbar"
import OrderProductShippingDisclosure from "./OrderProductShippingDisclosure"
import DownloadInvoiceButton from "./DownloadInvoiceButton"

type OrderItemProps = {
    orderItem: OrderDataModel
}

const OrderItemCard = ({ orderItem }: OrderItemProps) => {

    return (
        <Link className='card rounded-none card-bordered' href={`/user/orders/${orderItem._id}`}>
            <div className="flex items-center justify-between p-3 bg-secondary max-sm:flex-col">
                <div className="">Order # <b>{orderItem._id}</b></div>
                <div className="">Placed On: {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
                <div className="">Shipped To: {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
                <div className="flex flex-col">
                    <div className=""><b>Total: {orderItem.userCurrency.currencySymbol} {orderItem.orderValue.toFixed(0)}</b></div>
                    <div className="flex space-x-10">
                        <DownloadInvoiceButton className="link" orderId={orderItem._id} text="Invoice" />
                        <span className="max-md:link md:btn md:btn-sm">View</span>
                    </div>
                </div>
            </div>
            <OrderTrackingProgressbar orderStatus={orderItem.orderStatus} className="card-body max-sm:px-3" />
            <OrderProductShippingDisclosure orderItem={orderItem} />
        </Link>
    )
}



export default OrderItemCard