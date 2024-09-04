import Link from "next/link"
import Flicked from '../../Sliders/Flicked'
import CategoriesDataModel from "@/lib/types/CategoriesDataModel"
import Image from "next/image"
import clsx from "clsx"


type propTypes = {
    categoriesList: Array<CategoriesDataModel>
    className: string
}

export const dynamic = 'force-dynamic';

const ShopByCategory = ({ categoriesList, className }: propTypes) => {
    return (
        <div className={clsx(className)}>
            <h2 className="text-lg md:text-xl font-bold mx-5 mb-3">Shop By Category</h2>
            <Flicked options={{
                dragThreshold: 10,
                selectedAttraction: 0.01,
                friction: 0.15,
                pageDots: false,
                groupCells: true,
                cellAlign: 'left',
                contain:true
            }} className="px-5" >
                {
                    categoriesList.map(category => {
                        return <Link key={category._id} href={`/products/category/${category.name}`}>
                            <div className="rounded-tl-3xl mx-3">
                                <div className="rounded-tl-[40px] rounded-md overflow-hidden relative sm:h-40 sm:w-32 lg:h-52 lg:w-40">
                                    <Image src={category.imgSrc} alt={category.name} className="!object-cover !object-center" quality={10} fill/>
                                </div>
                                <div className="text-lg font-bold text-center py-2 sm:w-32 lg:w-40">{category.name}</div>
                            </div>
                        </Link>
                    })
                }
            </Flicked>
        </div>
    )
}

export default ShopByCategory