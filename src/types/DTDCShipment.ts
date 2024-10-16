// To parse this data:
//
//   import { Convert, DTDCShipment } from "./file";
//
//   const dTDCShipment = Convert.toDTDCShipment(json);

export type DTDCShipment = {
    status: string;
    data: Data;
}

export type Data = {
    status_external: string;
    current_event_description: string;
    location: string;
    status_internal: string;
    timestamp: number;
    tracking: Tracking[];
    extra_details: ExtraDetails;
    type: string;
    rto_awb_num: string;
    next_track_at: number;
    consignment: Consignment;
}

export type Consignment = {
    srcAddress: Address;
    dstAddress: Address;
    retAddress: AltDeliveryAddress1;
    retAddressExceptional: AltDeliveryAddress1;
    altDeliveryAddress1: AltDeliveryAddress1;
    altDeliveryAddress2: AltDeliveryAddress1;
    redirectionAddress: AltDeliveryAddress1;
    givenDim: Dim;
    givenPrice: any;
    givenWeight: any;
    serviceType: string;
    AWBNo: string;
    correctDim: Dim;
    correctPrice: any;
    correctWeight: any;
    processStatus: string;
    status: string;
    courierType: string;
    GSTflag: boolean;
    GSTInvoice: ExtraDetails;
    ewayBill: ExtraDetails;
    PUDO: Pudo;
    modeOfParcel: string;
    declaredPrice: any;
    isSyncWithDTDC: boolean;
    isRiskSurchargeApplicable: boolean;
    riskSurchargeType: string;
    discountPercent: number;
    discountAmount: number;
    pickUpCharges: any;
    discountAmountPickup: any;
    prepaidAmount: string;
    serviceCode: string;
    VAS: ExtraDetails;
    commodityId: any;
    commodityName: any;
    PUOrRequestTimestamp: any;
    isInternational: boolean;
    bookingTime: number;
    referenceNumber: string;
    clientNumber: string;
    customerReferenceNumber: any;
    noOfPieces: number;
    pieceDetails: PieceDetail[];
    itemDetails: string;
    RACPrice: number;
    bookingBranchCode: any;
    paymentStatus: any;
    extraPaymentAmountRequested: number;
    employeeCode: string;
    paymentMode: string;
    paymentUtr: any;
    volumetricWeight: any;
    serviceProvider: string;
    countryName: string;
    packingMaterial: string;
    noOfStretchFilms: number;
    consignmentType: string;
    gstRate: number;
    region: string;
    flagInsured: string;
    creationSource: string;
    freightChargeWithoutGST: any;
    freightChargeWithGST: any;
    fuelSurcharge: any;
    paperWorks: any;
    vasCodeDetails: VasCodeDetails;
    description: any;
    accountType: string;
}

export type ExtraDetails = {
}

export type Pudo = {
    date: string;
    slot: Slot;
}

export type Slot = {
    end: string;
    start: string;
}

export type AltDeliveryAddress1 = {
    name: any;
    phone: any;
    alternate_phone: any;
    addressLine1: any;
    addressLine2: any;
    cityName: any;
    stateName: any;
    country: any;
    pincode: any;
    email: any;
}

export type Dim = {
    width: string;
    height: string;
    length: string;
}

export type Address = {
    alternate_phone: any | string;
    cityName: any;
    stateName: any;
    country: string;
    pincode: string;
}

export type PieceDetail = {
    len: any;
    width: any;
    height: any;
    weight: any;
    volume_unit: string;
    weight_unit: string;
    dimension_unit: string;
    denormalized_volume_unit: string;
    denormalized_weight_unit: string;
    denormalized_dimension_unit: string;
}

export type VasCodeDetails = {
    vasCode: any;
    codAmount: number;
    modeOfCollection: any;
    inFavourOf: any;
}

export type Tracking = {
    location: string;
    timestamp: number;
    event_description: string;
    status_external: string;
    status_internal: string;
    type: string;
    awb_number: string;
    extra_details: ExtraDetails;
}

// Converts JSON strings to/from your types
export class DTDCShipmentConvert {
    public static toDTDCShipment(json: string): DTDCShipment {
        return JSON.parse(json);
    }

    public static dTDCShipmentToJson(value: DTDCShipment): string {
        return JSON.stringify(value);
    }
}


export function isDHLShipment(x: any): x is DTDCShipment {
    return (x as DTDCShipment).data != undefined
}