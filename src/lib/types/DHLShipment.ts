export type DHLShipment = {
    shipments: Shipment[];
}

export type Shipment = {
    id: string;
    service: string;
    origin: Destination;
    destination: Destination;
    status: Status;
    details: Details;
    events: Event[];
}

export type Destination = {
    address: Address;
    servicePoint: ServicePoint;
}

export type Address = {
    addressLocality: string;
}

export type ServicePoint = {
    url: string;
    label: string;
}

export type Details = {
    proofOfDelivery: ProofOfDelivery;
    proofOfDeliverySignedAvailable: boolean;
    totalNumberOfPieces: number;
    pieceIds: string[];
}

export type ProofOfDelivery = {
    signatureUrl: string;
    documentUrl: string;
}

export type Event = {
    timestamp: Date;
    location: Location;
    description: string;
    pieceIds?: string[];
}

export type Location = {
    address: Address;
}

export type Status = {
    timestamp: Date;
    location: Location;
    statusCode: string;
    status: string;
    description: string;
}

// Converts JSON strings to/from your types
export class DHLShipmentConvert {
    public static toDHLShipment(json: string): DHLShipment {
        return JSON.parse(json);
    }

    public static dHLShipmentToJson(value: DHLShipment): string {
        return JSON.stringify(value);
    }
}

export function isDHLShipment(x: any): x is DHLShipment {
    return (x as DHLShipment).shipments != undefined
}
