import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import Script from 'next/script'
import React from 'react'

const InformationTabs = ({ product }: { product: ProductDataModelWithColorMap }) => {
    return (
        <>
            <div className="flex max-md:flex-col ~py-10/20">
                <div className="flex flex-col">
                    <button className="bg-accent text-white py-2 px-5 border-b border-white tablinks" data-tab-id="defaultOpen">Description</button>
                    <button className="bg-accent text-white py-2 px-5 border-b border-white tablinks" data-tab-id="tab-highlights">Highlights</button>
                    <button className="bg-accent text-white py-2 px-5 tablinks" data-tab-id="tab-care">Care</button>
                </div>
                <div className=" w-full min-h-40 bg-gray-200 ~p-10/16">
                    <div className="text-gray-600 tabcontent" id="defaultOpen" dangerouslySetInnerHTML={{ __html: product.productDescriptionLong }}>
                    </div>
                    <ul className="text-gray-600 tabcontent list-disc" id="tab-highlights">
                        {product.highlights.map(hl => <li key={hl} className='list-item leading-6'>{hl}</li>)}
                    </ul>
                    <div className="text-gray-600 tabcontent list-disc" id="tab-care">
                        {product.careInstructions.map(hl => <li key={hl} className='list-item leading-6'>{hl}</li>)}
                    </div>
                </div>
            </div>
            <Script id='tab_controller' src='/tabhandler.js' />
        </>
    )
}

export default InformationTabs