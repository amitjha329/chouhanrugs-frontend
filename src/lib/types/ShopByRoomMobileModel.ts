import ShopByMobileSliderDataModel from "./ShopByMobileSliderDataModel";

export interface ShopByRoomMobileModel {
    _id?:      string;
    dataType?: string;
    page?:     string;
    content?:  ShopByMobileSliderDataModel[];
}