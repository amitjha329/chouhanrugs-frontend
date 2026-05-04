type CategoriesDataModel = {
    _id: string;
    name: string;
    slug?: string;
    description: string;
    seoTitle?: string;
    seoDescription?: string;
    popular: boolean;
    active: boolean;
    imgSrc: string;
    banner: string;
    parent?:string;
}

export default CategoriesDataModel
