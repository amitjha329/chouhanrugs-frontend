import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import getProductWithId from "@/lib/actions/getProductWithId"
import OrderDataModel from "@/lib/types/OrderDataModel"
import { ProductDataModel, ProductDataModelWithColorMap } from "@/lib/types/ProductDataModel"

const OrderProductsList = ({ order, expanded }: { order: OrderDataModel, expanded: boolean }) => {
    const [productList, setProductList] = useState<(ProductDataModelWithColorMap|null)[]>([])

    useEffect(() => {
        if (expanded) {
            const productPromiseList: Array<Promise<ProductDataModelWithColorMap|null>> = []
            order.products.forEach(item => productPromiseList.push(getProductWithId(item.productId)))
            getAllProductsForOrder(productPromiseList).catch(e => console.log(e))
        }
    }, [expanded])

    const getAllProductsForOrder = async (promiseList: Array<Promise<ProductDataModelWithColorMap|null>>) => {
        const result = await Promise.all(promiseList)
        setProductList(result)
    }

    return (
        <div className='flex flex-col gap-5'>
            {
                productList.length > 0 && productList.map(product => {
                    return product && <Link key={product._id?.toString()} href={`/products/${product._id}`} className='card card-side rounded-none card-bordered hover:bg-gray-100'>
                        <figure>
                            <Image src={product.images[product.productPrimaryImageIndex]} alt={product.productName} fill className='!relative max-h-40 aspect-1/1' />
                        </figure>
                        <div className='card-body'>
                            <div className='card-title text-lg'>{product.productName}</div>
                        </div>
                        <p>{product.productDescriptionShort}</p>
                    </Link>
                })
            }
        </div>
    )
}

export default OrderProductsList