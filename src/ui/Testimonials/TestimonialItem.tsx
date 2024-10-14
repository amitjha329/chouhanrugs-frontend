import Image from 'next/image'
import React from 'react'
import client_sample from '../../../static_assets/profile.webp';
import verified from '../../../static_assets/verified.svg';

const TestimonialItem = (props: TestimonialDataModel) => {
    return (
        <div className='flex flex-col break-inside-avoid-column max-md:carousel-item max-md:w-full'>
            <div className='testimonial_content card card-body'>
                <div className='text-xs text-gray-600'>{props.description}</div>
            </div>
            <div className='flex justify-between items-center gap-5'>
                <div className="avatar mt-5">
                    <div className="mask mask-hexagon w-24">
                        <Image src={client_sample} alt={props.client} />
                    </div>
                </div>
                <div className='flex-grow flex flex-col'>
                    <div>{props.client}</div>
                    <div className='text-xs text-gray-600 flex items-center'><Image src={verified} alt="verified" />Verified Buyer</div>
                </div>
            </div>
        </div>
    )
}

export default TestimonialItem