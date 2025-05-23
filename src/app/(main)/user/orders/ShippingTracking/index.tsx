import { DHLShipment, isDHLShipment } from "@/types/DHLShipment";
import { DTDCShipment } from "@/types/DTDCShipment";
import ShippingTrackingDHL from "./ShippingTrackingDHL";
import ShippingTrackingDTDC from "./ShippingTrackingDTDC";

const ShippingTracking = ({ shipmentData }: { shipmentData: DHLShipment | DTDCShipment }) => {
    return (
        isDHLShipment(shipmentData) ? <ShippingTrackingDHL shipmentData={shipmentData} /> : <ShippingTrackingDTDC shipmentData={shipmentData} />
    );
}

export default ShippingTracking;