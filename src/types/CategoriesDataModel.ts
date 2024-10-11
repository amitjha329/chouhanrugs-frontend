type CategoriesDataModel = {
    _id: string;
    name: string;
    description: string;
    popular: boolean;
    active: boolean;
    imgSrc: string;
    banner: string;
    parent?:string;
}

export default CategoriesDataModel