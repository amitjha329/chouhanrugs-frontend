'use client'
import Flicked from "../../Sliders/Flicked"
import SectionHeader from "../SectionHeaders"
import VideoReviewCard from "../../Cards/VideoReviewCard"
import useOnScreenObserver from "@/lib/customHooks/useOnScreenObserver"
import textOverflowMarqueeHelper from "@/lib/utilities/textOverflowMarqueeHelper"
import { useState, useEffect, useRef } from "react"
import getTestimonials from "@/lib/actions/getTestimonials"
import TestimonialsSkeleton from "../../Skeletons/TestimonialsSkeleton"

const Testimonial = () => {
    const [testimonials, setTestimonials] = useState<TestimonialDataModel[]>()
    useEffect(() => {
        const elements = document.getElementsByClassName("categoryName")
        textOverflowMarqueeHelper(elements)
    }, [testimonials])

    const ref = useRef<HTMLDivElement>(null)
    const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px" })
    useEffect(() => {
        if (intersectionObserver && !testimonials) {
            getTestimonials().then((res) => {
                setTestimonials(res)
            })
        }
    }, [intersectionObserver, testimonials])
    return (
        <div ref={ref}>
            <section className="container mx-auto pb-16">
                <SectionHeader sectionTitle="Testimonials" />
                {
                    testimonials ? <Flicked options={{
                        groupCells: true,
                        pageDots: false,
                        dragThreshold: 10,
                        selectedAttraction: 0.01,
                        cellAlign: "center",
                        friction: 0.15,
                        imagesLoaded: true,
                        autoPlay: true,
                        pauseAutoPlayOnHover: true
                    }} className="overflow-visible">
                        {testimonials.map(testimonial => {
                            // return <div key={testimonial._id} className="lg:flex rounded-lg overflow-hidden">
                            //     <div className="h-56 lg:h-auto lg:w-5/12 relative flex items-center justify-center">
                            //         <div className="absolute inset-0 bg-secondary opacity-75" />
                            //         <Image
                            //             className="relative"
                            //             width={200}
                            //             height={120}
                            //             src={testimonial.testimonialImage}
                            //             alt={testimonial.title}
                            //         />
                            //     </div>
                            //     <div className="relative lg:w-7/12 bg-white">
                            //         <svg
                            //             className="absolute h-full text-white w-24 -ml-12"
                            //             fill="currentColor"
                            //             viewBox="0 0 100 100"
                            //             preserveAspectRatio="none"
                            //         >
                            //             <polygon points="50,0 100,0 50,100 0,100" />
                            //         </svg>
                            //         <div className="relative py-12 lg:py-24 px-8 lg:px-16 text-gray-700 leading-relaxed">
                            //             <div>
                            //                 {testimonial.description}
                            //             </div>
                            //         </div>
                            //     </div>
                            // </div>
                            return <VideoReviewCard key={testimonial._id} testimonial={testimonial} />
                        })}
                    </Flicked> : <TestimonialsSkeleton />
                }
            </section>
        </div>
    )
}

export default Testimonial