import { ProductDataModel } from "@/types/ProductDataModel"
import NewProductCard from "../Product/NewProductCard"

const ProductCarouselBasic = async ({ products }: { products: ProductDataModel[] }) => {

    return (
        <div className="carousel carousel-center max-w-full space-x-4 p-4 z-30">
            {
                products.map(product => {
                    return <NewProductCard key={product._id?.toString()} {...product} className="carousel-item" />
                })
            }
        </div>
    )
}

export default ProductCarouselBasic