import { getHomePageOrderProcessInformation, getHomePageShopByRoom, getHomePageWhyUsSection, getPageFooterContent } from '@/lib/actions/getPageAdditionalData'
import getPageData from '@/lib/actions/getPageData'
import FooterContentForm from '@/ui/backend/Forms/PageEdit/FooterContentForm'
import StepFourForm from '@/ui/backend/Forms/PageEdit/OrderProcessSteps/StepFourForm'
import StepOneForm from '@/ui/backend/Forms/PageEdit/OrderProcessSteps/StepOneForm'
import StepThreeForm from '@/ui/backend/Forms/PageEdit/OrderProcessSteps/StepThreeForm'
import StepTwoForm from '@/ui/backend/Forms/PageEdit/OrderProcessSteps/StepTwoForm'
import OrderProcessTitleForm from '@/ui/backend/Forms/PageEdit/OrderProcessSteps/TitleForm'
import PageEditingForm from '@/ui/backend/Forms/PageEdit/PageEditingForm'
import ShopByRoomForm from '@/ui/backend/Forms/PageEdit/ShopByRoomForm'
import WhyShopWithUs from '@/ui/backend/Forms/PageEdit/WhyShopWithUs'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Page Settings',
}

const SiteSettings = async ({ params }: { params: { pageEdit: string } }) => {
    const pageDataPromise = getPageData(params.pageEdit)
    const pageOrderInformationPromise = getHomePageOrderProcessInformation()
    const footerContentDataPromise = getPageFooterContent(params.pageEdit)
    const shopByRoomPromise = getHomePageShopByRoom()
    const whyShoWithUsPromise = getHomePageWhyUsSection()
    const [pageData, pageOrderInformation, footerContentData, shopByRoomContent, whyShopWithUs] = await Promise.all([pageDataPromise, pageOrderInformationPromise, footerContentDataPromise, shopByRoomPromise, whyShoWithUsPromise])
    return (
        <>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <div className='card-body'>
                    <PageEditingForm pageData={pageData} page={decodeURI(params.pageEdit)} />
                </div>
            </div>
            {
                params.pageEdit == "home" && <>
                    <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
                        <div className='card-body'>
                            <div className='card-title'>Order Process/Steps</div>
                            <div className='card-body'>
                                <div className='card-title'>Title:</div>
                                <OrderProcessTitleForm data={pageOrderInformation?.title ?? ""} />
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='card-body'>
                                    <div className='card-title'>Step 1:</div>
                                    <StepOneForm data={pageOrderInformation?.steps?.stepOne} />
                                </div>
                                <div className='card-body'>
                                    <div className='card-title'>Step 2:</div>
                                    <StepTwoForm data={pageOrderInformation?.steps.stepTwo} />
                                </div>
                                <div className='card-body'>
                                    <div className='card-title'>Step 3:</div>
                                    <StepThreeForm data={pageOrderInformation?.steps.stepThree} />
                                </div>
                                <div className='card-body'>
                                    <div className='card-title'>Step 4:</div>
                                    <StepFourForm data={pageOrderInformation?.steps.stepFour} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
                        <div className='card-body'>
                            <div className='card-title'>Shop By Room</div>
                            <div className="card-body">
                                <ShopByRoomForm data={shopByRoomContent} />
                            </div>
                        </div>
                    </div>
                    <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
                        <div className='card-body'>
                            <div className='card-title'>Why Shop With Us Section</div>
                            <div className="card-body">
                                <WhyShopWithUs data={whyShopWithUs} />
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                (params.pageEdit == "home") &&  <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
                    <div className='card-body'>
                        <div className='card-title'>Foooter Content</div>
                        <FooterContentForm data={footerContentData} page={params.pageEdit} />
                    </div>
                </div>
            }
        </>
    )
}

export default SiteSettings