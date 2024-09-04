import { DHLShipment } from '@/lib/types/DHLShipment';
import '@/styles/custom/ShippingTracking.scss'
const ShippingTrackingDHL = ({ shipmentData }: { shipmentData: DHLShipment }) => {
    return (
        <section className='p-5'>
            <div className="text-lg font-bold">Sipment Details</div>
            <div className="order-track">
                {
                    shipmentData.shipments[0].events.map(event =>
                        <div className="order-track-step" key={event.timestamp.toString()}>
                            <div className="order-track-status">
                                <span className="order-track-status-dot" />
                                <span className="order-track-status-line" />
                            </div>
                            <div className="order-track-text">
                                <p className="order-track-text-stat">{event.description}</p>
                                <span className="order-track-text-sub">{(new Date(event.timestamp)).toLocaleString()}</span>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    );
}

export default ShippingTrackingDHL;