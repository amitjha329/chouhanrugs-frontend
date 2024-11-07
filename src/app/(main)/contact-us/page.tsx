import getSiteData from '@/backend/serverActions/getSiteData'
import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTwitter, FaYoutube } from 'react-icons/fa'
import ContactUsSideVector from './ContactUsSideVector'
import Link from 'next/link'

const ContactUsPage = async () => {
    const siteInfo = await getSiteData()
    return (<>
        <div className="w-full flex flex-col items-center justify-center mt-14 px-10">
            <div className="text-4xl font-bold mb-8">Contact Us</div>
            <div className="text-xl text-center">Have doubts and question, or want to leave a remark? Leave us a message.</div>
        </div>
        <div className="max-w-screen-xl my-14 grid gap-8 grid-cols-1 md:grid-cols-2 py-16 mx-auto bg-gray-100 text-gray-900 rounded-lg shadow-lg mb-60 max-sm:mb-40">
            <div className="flex md:flex-row flex-col-reverse justify-between">
                <div className="flex md:flex-col flex-row justify-center pl-3 md:pl-5 lg:pl-7 xl:pl-14 md:gap-y-5 gap-x-5 mt-8 md:mt-0">
                    {
                        siteInfo.profiles.map(profile => (
                            <Link
                                key={profile}
                                href={profile}
                            >
                                {
                                    ["facebook.com", "www.facebook.com", "fb.me"].includes((new URL(profile)).hostname) && <>
                                        <FaFacebook className="h-8 w-8 hover:text-[#0e8cf1]" />
                                        <span className="sr-only">Facebook page</span>
                                    </>
                                }
                                {
                                    ["instagram.com", "www.instagram.com"].includes((new URL(profile)).hostname) && <>
                                        <FaInstagram className="h-8 w-8 hover:text-[#fe016a]" />
                                        <span className="sr-only">Instagram page</span>
                                    </>
                                }
                                {
                                    ["twitter.com", "www.twitter.com",].includes((new URL(profile)).hostname) && <>
                                        <FaTwitter className="h-8 w-8 hover:text-[#1a8cd8]" />
                                        <span className="sr-only">Twitter page</span>
                                    </>
                                }
                                {
                                    ["pinterest.com", "www.pinterest.com", "in.pinterest.com"].includes((new URL(profile)).hostname) && <>
                                        <FaPinterest className="h-8 w-8 hover:text-[#e60023]" />
                                        <span className="sr-only">Pinterest page</span>
                                    </>
                                }
                                {
                                    ["youtube.com", "www.youtube.com"].includes((new URL(profile)).hostname) && <>
                                        <FaYoutube className="h-8 w-8 hover:text-[#ff0000]" />
                                        <span className="sr-only">Youtube page</span>
                                    </>
                                }
                                {
                                    ["www.linkedin.com", "linkedin.com"].includes((new URL(profile)).hostname) && <>
                                        <FaLinkedin className="h-8 w-8 hover:text-[#0a66c2]" />
                                        <span className="sr-only">Linkedin page</span>
                                    </>
                                }
                            </Link>
                        ))
                    }
                </div>
                <div className="flex flex-col justify-between sm:pl-5 md:pl-7 lg:pl-9 xl:pl-20">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-center md:text-left">
                            Lets talk about everything!
                        </h2>
                        <div className="text-gray-700 mt-8 text-center md:text-left">
                            Hate forms? Send us an <a href={`mailto:${siteInfo.contact_details.email}`} className="underline cursor-pointer">email</a> instead.
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <ContactUsSideVector />
                    </div>
                </div>
            </div>
            <div className="pr-8 pl-8 md:pl-0 md:pr-12 lg:pr-16 xl:pr-32">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text text-base">What is your name?</span>
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" />
                </div>
                <div className="form-control w-full mt-8">
                    <label className="label">
                        <span className="label-text text-base">Your email address?</span>
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" />
                </div>
                <div className="form-control mt-8">
                    <label className="label">
                        <span className="label-text">Your Message?</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-24" placeholder="Your Message"></textarea>
                </div>
                <div className="mt-8">
                    <button className="btn uppercase text-sm font-bold tracking-wide bg-primary text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline">
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    </>
    )
}

export default ContactUsPage