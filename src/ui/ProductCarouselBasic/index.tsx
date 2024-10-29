import { ProductDataModel } from "@/types/ProductDataModel"
import ProductCardItem from "../Product/ProductCardItem"
import SectionTitle from "../SectionTitle"

const ProductCarouselBasic = async ({ products, sectionHeading }: { products: ProductDataModel[], sectionHeading: string }) => {

    return (
        <div className="fluid_container mx-auto ~py-10/20">
            <SectionTitle title={sectionHeading} className="text-center ~pb-10/16" />
            <div className="carousel space-x-4 max-w-full">
                {
                    products.map(product => {
                        return <ProductCardItem key={product._id?.toString()} {...product} className="carousel-item max-w-72" />
                    })
                }
            </div>
        </div>
    )
}

export default ProductCarouselBasic