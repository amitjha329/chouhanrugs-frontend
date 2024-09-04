type ReviewDataModel = {
    productId: string;
    userId: string | undefined;
    reviewTitle: string;
    reviewRating: string|number;
    reviewDetailed: string;
    reviewImages: Array<File>|Array<string>,
    postedOn:string
}
export default ReviewDataModel