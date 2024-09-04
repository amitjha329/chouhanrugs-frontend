'use client'
import { useRef, useState } from "react";
import { BsFillPatchCheckFill, BsFillPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs";
import { MdReplayCircleFilled } from "react-icons/md";
import Image from 'next/image'
import { stringNotEmptyOrNull } from "@/lib/utilities/stringEmptyOrNull";

const VideoReviewCard = ({ testimonial }: { testimonial: TestimonialDataModel }) => {
    const ref = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)
    return (
        <div className="w-80 rounded-lg bg-white shadow-lg overflow-hidden m-5">
            <figure className="relative">
                {
                    stringNotEmptyOrNull(testimonial.testimonialVideo) ? <video src={testimonial.testimonialVideo} className="w-full h-96 object-cover" ref={ref} onPlay={() => { setPlaying(true) }} onPause={() => { setPlaying(false) }} /> : <Image src={testimonial.testimonialImage} alt="" className="!relative !w-full !h-96 object-cover" fill />
                }
                {
                    !playing && !ref.current?.ended && stringNotEmptyOrNull(testimonial.testimonialVideo) && <BsFillPlayCircleFill size={50} className="opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white" onClick={() => {
                        ref.current?.play()
                    }} />
                }
                {
                    playing && !ref.current?.ended && stringNotEmptyOrNull(testimonial.testimonialVideo) && <BsFillPauseCircleFill size={50} className="opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white" onClick={() => {
                        ref.current?.pause()
                    }} />
                }
                {
                    ref.current?.ended && !playing && stringNotEmptyOrNull(testimonial.testimonialVideo) && <MdReplayCircleFilled size={50} className="opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white" onClick={() => {
                        ref.current?.play()
                    }} />
                }
            </figure>
            <h2 className="card-title absolute top-3 left-3 bg-white rounded p-1">{testimonial.client}</h2>
            <div className="bg-slate-800 items-center justify-center gap-2 flex text-white py-2"><BsFillPatchCheckFill className="text-green-500" /> Verified Buyer</div>
            <div className="flex flex-col px-5 py-7">
                <p>{testimonial.description}</p>
            </div>
        </div>
    );
}

export default VideoReviewCard;