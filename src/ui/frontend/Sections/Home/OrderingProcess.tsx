'use server'
import React from 'react'
import Image from 'next/image'
import { getHomePageOrderProcessInformation } from '@/lib/actions/getPageAdditionalData'
// import useOnScreenObserver from '@/lib/customHooks/useOnScreenObserver'
// import OrderProcessStepsDataModel from '@/lib/types/OrderProcessStepsDataModel'


const OrderingProcess = async () => {
    const orderInformationData = await getHomePageOrderProcessInformation();
    // const ref = useRef<HTMLDivElement>(null)
    // const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px" })
    // const [orderInformationData, setOrderInformationData] = useState<OrderProcessStepsDataModel>()
    // useEffect(() => {
    //     if (intersectionObserver && !orderInformationData) {
    //         getHomePageOrderProcessInformation().then((res) => {
    //             console.log(res)
    //             setOrderInformationData(res)
    //         })
    //     }
    // }, [intersectionObserver, orderInformationData])

    return <div className='flex items-center justify-center'>
        <section className="sm:container mx-auto mt-10 max-sm:mx-4 card card-bordered shadow-xl rounded-none">
            <h1 className="text-lg font-medium md:text-3xl p-3" dangerouslySetInnerHTML={{ __html: orderInformationData?.title ?? "" }}></h1>
            <div className='grid md:grid-cols-4 grid-cols-2 gap-2 sm:gap-6 mb-5'>
                <div className='card items-center max-sm:card-side mx-auto'>
                    <figure>
                        <Image src={orderInformationData?.steps.stepOne.icon ?? ""} alt='' height={100} width={100} className='!h-10 md:!h-24 !w-10 md:!w-24 object-contain' priority />
                    </figure>
                    <div className='md:card-title'>
                        {orderInformationData?.steps.stepOne.title ?? ""}
                    </div>
                    <div className='card-body  hidden md:block'>
                        {orderInformationData?.steps.stepOne.description ?? ""}
                    </div>
                </div>
                <div className='card items-center max-sm:card-side mx-auto'>
                    <figure>
                        <Image src={orderInformationData?.steps.stepTwo.icon ?? ""} alt='' height={100} width={100} className='!h-10 md:!h-24 !w-10 md:!w-24 object-contain' priority />
                    </figure>
                    <div className='md:card-title'>
                        {orderInformationData?.steps.stepTwo.title ?? ""}
                    </div>
                    <div className='card-body  hidden md:block'>
                        {orderInformationData?.steps.stepTwo.description ?? ""}
                    </div>
                </div>
                <div className='card items-center max-sm:card-side mx-auto'>
                    <figure>
                        <Image src={orderInformationData?.steps.stepThree.icon ?? ""} alt='' height={100} width={100} className='!h-10 md:!h-24 !w-10 md:!w-24 object-contain' priority />
                    </figure>
                    <div className='md:card-title'>
                        {orderInformationData?.steps.stepThree.title ?? ""}
                    </div>
                    <div className='card-body  hidden md:block'>
                        {orderInformationData?.steps.stepThree.description ?? ""}
                    </div>
                </div>
                <div className='card items-center max-sm:card-side mx-auto'>
                    <figure>
                        <Image src={orderInformationData?.steps.stepFour.icon ?? ""} alt='' height={100} width={100} className='!h-10 md:!h-24 !w-10 md:!w-24 object-contain' priority />
                    </figure>
                    <div className='md:card-title'>
                        {orderInformationData?.steps.stepFour.title ?? ""}
                    </div>
                    <div className='card-body  hidden md:block'>
                        {orderInformationData?.steps.stepFour.description ?? ""}
                    </div>
                </div>
            </div>
        </section>
    </div>
}

export default OrderingProcess