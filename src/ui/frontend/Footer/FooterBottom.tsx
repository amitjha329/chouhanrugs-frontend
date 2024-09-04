import Link from "next/link"
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa"

const FooterBottom = ({ siteTitle, profiles }: { siteTitle: string, profiles: string[] }) => {
    return (
        <div className="py-6 px-4 flex flex-col md:flex-row md:items-end md:justify-between justify-center bg-primary">
            <span className="text-sm text-white text-center">
                &copy; 2022 <Link href="/">{siteTitle}</Link>. All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-6 justify-center md:mt-0">
                {
                    profiles?.map(profile => (
                        <a
                            key={profile}
                            href={profile}
                        >
                            {
                                ["facebook.com", "www.facebook.com", "fb.me"].includes((new URL(profile)).hostname) && <>
                                    <FaFacebook className="h-6 w-6 hover:text-[#0e8cf1] text-white" />
                                    <span className="sr-only">Facebook page</span>
                                </>
                            }
                            {
                                ["instagram.com", "www.instagram.com"].includes((new URL(profile)).hostname) && <>
                                    <FaInstagram className="h-6 w-6 hover:text-[#fe016a] text-white" />
                                    <span className="sr-only">Instagram page</span>
                                </>
                            }
                            {
                                ["twitter.com", "www.twitter.com",].includes((new URL(profile)).hostname) && <>
                                    <FaTwitter className="h-6 w-6 hover:text-[#1a8cd8] text-white" />
                                    <span className="sr-only">Twitter page</span>
                                </>
                            }
                            {
                                ["pinterest.com", "www.pinterest.com", "in.pinterest.com"].includes((new URL(profile)).hostname) && <>
                                    <FaPinterest className="h-6 w-6 hover:text-[#e60023] text-white" />
                                    <span className="sr-only">Pinterest page</span>
                                </>
                            }
                            {
                                ["youtube.com", "www.youtube.com"].includes((new URL(profile)).hostname) && <>
                                    <FaYoutube className="h-6 w-6 hover:text-[#ff0000] text-white" />
                                    <span className="sr-only">Youtube page</span>
                                </>
                            }
                            {
                                ["www.linkedin.com", "linkedin.com"].includes((new URL(profile)).hostname) && <>
                                    <FaLinkedin className="h-6 w-6 hover:text-[#0a66c2] text-white" />
                                    <span className="sr-only">Linkedin page</span>
                                </>
                            }
                        </a>
                    ))
                }
            </div>
        </div>
    )
}

export default FooterBottom