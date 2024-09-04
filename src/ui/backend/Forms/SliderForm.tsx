'use client'
import deleteSlideFromSlider from '@/lib/actions/deleteSlideFromSlider'
import saveSlideForm from '@/lib/actions/saveSlideForm'
import SliderDataModel, { Slides } from '@/lib/types/SliderDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'

const SliderForm = ({ slider }: { slider: SliderDataModel }) => {
    const router = useRouter()
    const slide: Slides = {
        src: "",
        title: "",
        heading: "",
        desc: ""
    }
    const [sliderDescription, setSliderDescription] = useState(slider.slideDescription)
    const [slides, setSlides] = useState(slider.images)

    return (
        <div className='card-body'>
            <div className='card-title'>Enter Slider Details</div>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Slider Description</span>
                <input type="text" value={sliderDescription} className='input input-bordered w-full' name="product_name" placeholder='Name' required onChange={e => { setSliderDescription(e.currentTarget.value) }} />
            </label>
            <div className='card card-bordered card-body'>
                <div className='card-title'>Slides</div>
                <div className='flex flex-col gap-y-3' >
                    {
                        slides.map((slideItem, index) => {
                            return (
                                <div key={slideItem.title} className="card card-bordered card-side justify-between card-body items-center">
                                    <div className='card-title'>Title: {slideItem.title}</div>
                                    <div className='font-thin'>Heading: {slideItem.heading}</div>
                                    <div className='font-thin'>Description: {slideItem.desc}</div>
                                    <div>
                                        <div className='realtive h-20 w-full'>
                                            <Image src={slideItem.src.toString()} alt={slideItem.title} className="!relative !h-full !w-auto mx-auto" fill />
                                        </div>
                                    </div>
                                    <button className='btn btn-error btn-lg btn-outline' onClick={() => {
                                        deleteSlideFromSlider(slider._id, slideItem.src.toString()).then(res => {
                                            if (res.ack) {
                                                onPageNotifications("success", "Slide Removed").then(() => {
                                                    router.back()
                                                })
                                            } else {
                                                console.log(res.result)
                                            }
                                        }).catch(err => console.log(err))
                                    }}><MdDelete /></button>
                                </div>
                            )
                        })
                    }
                    <Link href={`/admin/cms/sliders/edit/${slider.slideId}/new/${slider._id}`} className='btn btn-outline'>Add More</Link>
                </div>
            </div>
            <div className='card-actions justify-end'>
                <button type='submit' className='btn' onClick={() => {
                    saveSlideForm(slider._id, sliderDescription).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Slide Updated").then(() => {
                                router.back()
                            })
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Update Slider</button>
            </div>
        </div>
    )
}

export default SliderForm