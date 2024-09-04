'use client'

import deleteImage from "@/lib/actions/deleteImage"
import saveTestimonialForm from "@/lib/actions/saveTestimonialForm"
import uploadImages from "@/lib/actions/uploadImages"
import uploadVideo from "@/lib/actions/uploadVideo"
import stringEmptyOrNull from "@/lib/utilities/stringEmptyOrNull"
import onPageNotifications from "@/ui/common/onPageNotifications"
import { useRouter } from "next/navigation"
import { useState } from "react"

const TestimonialForm = ({ testimonial }: { testimonial: TestimonialDataModel }) => {
    const [title, setTitle] = useState(testimonial.title ?? "")
    const [client, setClient] = useState(testimonial.client ?? "")
    const [description, setDescription] = useState(testimonial.description ?? "")
    const [imageLink, setImageLink] = useState(testimonial.testimonialImage ?? "")
    const [videoLink, setVideoLink] = useState(testimonial.testimonialVideo ?? "")
    const router = useRouter()
    return (
        <>
            <div className="mt-2">
                <form className='form-control space-y-3' id='testimonial_creation_form' onSubmit={e => {
                    e.preventDefault()
                    console.log(testimonial._id)
                    saveTestimonialForm(
                        {
                            _id: testimonial._id,
                            client,
                            description,
                            testimonialImage: imageLink,
                            title,
                            updatedOn: Date.now().toString(),
                            testimonialVideo: videoLink,
                            publishedOn: Date.now().toString()
                        }
                    ).then(result => {
                        result.ack ?
                            onPageNotifications("success", "Testimonial Saved/Updated")
                            :
                            onPageNotifications("error", "Testimonial Update Failed")
                    })
                }}>
                    <input className='input input-bordered w-full' placeholder='Testimonials Title' name='testimonialTitle' value={title} onChange={e => setTitle(e.currentTarget.value)} required />
                    <input className='input input-bordered w-full' placeholder='Testimonial Client' name='testimonialClient' value={client} onChange={e => setClient(e.currentTarget.value)} required />
                    <textarea className='input input-bordered w-full' placeholder='Testimonial Description' name='testimonialDesc' value={description} onChange={e => setDescription(e.currentTarget.value)} required />
                    <input type='file' className='file-input file-input-bordered w-full' name='testimonialsImage' onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", testimonial._id)
                            formData.append("type", "testimonial")
                            formData.append("image", fileList)
                            uploadImages(formData).then(result => {
                                if (result[0].url != testimonial.testimonialImage && !stringEmptyOrNull(testimonial.testimonialImage))
                                    deleteImage(testimonial.testimonialImage)
                                setImageLink(result[0].url)
                            }).catch(err => console.log(err))
                        }
                    }} required />
                    <input type='file' className='file-input file-input-bordered w-full' name='testimonialsImage' accept=".mp4" onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", testimonial._id)
                            formData.append("type", "testimonial")
                            formData.append("video", fileList)
                            uploadVideo(formData).then(result => {
                                if (result[0].url != testimonial.testimonialVideo && !stringEmptyOrNull(testimonial.testimonialVideo))
                                    deleteImage(testimonial.testimonialVideo ?? "")
                                setVideoLink(result[0].url)
                            }).catch(err => console.log(err))
                        }
                    }} />
                </form>
            </div>
            <div className="mt-4 btn-group">
                <button
                    type="submit"
                    className="btn btn-outline"
                    form='testimonial_creation_form'
                >
                    Update
                </button>
                <button
                    type="button"
                    className="btn btn-outline btn-error"
                    onClick={() => { router.back() }}
                >
                    Cancel
                </button>
            </div>
        </>
    );
}

export default TestimonialForm;