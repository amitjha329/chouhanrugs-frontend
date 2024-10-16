import { DTDCShipment } from "@/types/DTDCShipment";

const ShippingTrackingDTDC = ({ shipmentData }: { shipmentData: DTDCShipment }) => {
    return (
        <section className="p-5">
            <div className="text-lg font-bold">Sipment Details</div>
            <div className="order-track">
                <div className="order-track-step">
                    <div className="order-track-status">
                        <span className="order-track-status-dot" />
                        <span className="order-track-status-line" />
                    </div>
                    <div className="order-track-text">
                        <p className="order-track-text-stat">Order Received</p>
                        <span className="order-track-text-sub">21st November, 2019</span>
                    </div>
                </div>
                <div className="order-track-step">
                    <div className="order-track-status">
                        <span className="order-track-status-dot" />
                        <span className="order-track-status-line" />
                    </div>
                    <div className="order-track-text">
                        <p className="order-track-text-stat">Order Processed</p>
                        <span className="order-track-text-sub">21st November, 2019</span>
                    </div>
                </div>
                <div className="order-track-step">
                    <div className="order-track-status">
                        <span className="order-track-status-dot" />
                        <span className="order-track-status-line" />
                    </div>
                    <div className="order-track-text">
                        <p className="order-track-text-stat">Manufracturing In Progress</p>
                        <span className="order-track-text-sub">21st November, 2019</span>
                    </div>
                </div>
                <div className="order-track-step">
                    <div className="order-track-status">
                        <span className="order-track-status-dot" />
                        <span className="order-track-status-line" />
                    </div>
                    <div className="order-track-text">
                        <p className="order-track-text-stat">Order Dispatched</p>
                        <span className="order-track-text-sub">21st November, 2019</span>
                    </div>
                </div>
                <div className="order-track-step">
                    <div className="order-track-status">
                        <span className="order-track-status-dot" />
                        <span className="order-track-status-line" />
                    </div>
                    <div className="order-track-text">
                        <p className="order-track-text-stat">Order Deliverd</p>
                        <span className="order-track-text-sub">21st November, 2019</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ShippingTrackingDTDC;