import { ProductDataModel } from "./ProductDataModel";

type WishlistDataModel = {
    _id: string;
    userId: string;
    items?: (ProductDataModel|null)[];
    itemIds?: string[]
}

export default WishlistDataModel