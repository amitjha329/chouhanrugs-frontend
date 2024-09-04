import Image from "next/image"
import { ContactDetails } from "@/lib/types/SiteDataModel"
import { FaCcAmex, FaCcMastercard, FaCcPaypal, FaCcStripe, FaCcVisa, FaGooglePay } from "react-icons/fa"
import Link from 'next/link'
import getFooterLinks from "@/lib/actions/getFooterLinks"

const FooterMid = async ({ footerLogo, siteTitle, addressData }: { footerLogo: string, siteTitle: string, addressData: ContactDetails }) => {
    const footerLinks = await getFooterLinks()
    return (
        // <div className="flex flex-col pt-28 w-full border-t-2 border-t-gray-300 overflow-hidden bg-[#ffc0756e]">
        //     <div className="flex lg:items-center lg:justify-between flex-col lg:flex-row gap-y-[45px] py-[30px] lg:py-0 px-[15px] sm:px-[30px] md:px-[40px] lg:px-[50px] xl:px-[75px] h-auto lg:h-[380px] container mx-auto">
        //         <div className="lg:w-4/12">
        //             <div className="flex mb-8 text-gray-900 relative min-h-16">
        //                 {
        //                     footerLogo && <Image src={footerLogo} alt={siteTitle} fill className="!h-auto max-w-xs mx-auto !relative" />
        //                 }
        //             </div>
        //             <div className="text-center text-gray-600">
        //                 <FormattedAddress addressData={addressData} />
        //             </div>
        //         </div>
        //         <div className="flex justify-center sm:justify-between flex-wrap lg:flex-nowrap gap-y-[60px] gap-x-[90px] sm:gap-x-0 lg:w-7/12">
        //             <div className="text-center sm:text-left">
        //                 <div className="mb-[18px] text-gray-400 text-sm font-bold select-none">
        //                     Product
        //                 </div>
        //                 <ul className="flex flex-col gap-[10px] text-gray-600">
        //                     <a className="hover:underline" href="#">
        //                         <li>Overview</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Features</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Solutions</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Tutorials</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Pricing</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Releases</li>
        //                     </a>
        //                 </ul>
        //             </div>
        //             <div className="text-center sm:text-left">
        //                 <div className="mb-[18px] text-gray-400 text-sm font-bold select-none">
        //                     Company
        //                 </div>
        //                 <ul className="flex flex-col gap-[10px] text-gray-600">
        //                     <a className="hover:underline" href="#">
        //                         <li>About us</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Careers</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Press</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>News</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Media kit</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Contact</li>
        //                     </a>
        //                 </ul>
        //             </div>
        //             <div className="text-center sm:text-left">
        //                 <div className="mb-[18px] text-gray-400 text-sm font-bold select-none">
        //                     Resources
        //                 </div>
        //                 <ul className="flex flex-col gap-[10px] text-gray-600">
        //                     <a className="hover:underline" href="#">
        //                         <li>Blog</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Newsletter</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Events</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Help centre</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Tutorials</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Support</li>
        //                     </a>
        //                 </ul>
        //             </div>
        //             <div className="text-center sm:text-left">
        //                 <div className="mb-[18px] text-gray-400 text-sm font-bold select-none">
        //                     Legal
        //                 </div>
        //                 <ul className="flex flex-col gap-[10px] text-gray-600">
        //                     <a className="hover:underline" href="#">
        //                         <li>Terms</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Privacy</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Cookies</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Licenses</li>
        //                     </a>
        //                     <a className="hover:underline" href="#">
        //                         <li>Settings</li>
        //                     </a>
        //                     <Link className="hover:underline" href="/contact-us">
        //                         <li>Contact</li>
        //                     </Link>
        //                 </ul>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="flex flex-col pt-28 w-full border-t-2 border-t-gray-300 overflow-hidden bg-secondary bg-opacity-40">
            <div className="flex items-center justify-center flex-col lg:flex-row gap-y-[45px] py-[30px] lg:py-0 px-[15px] sm:px-[30px] md:px-[40px] lg:px-[50px] xl:px-[75px] h-auto lg:h-[380px] container mx-auto">
                <div className="lg:w-4/12">
                    <div className="flex mb-3 text-gray-900 relative min-h-16">
                        {
                            footerLogo && <Image src={footerLogo} alt={siteTitle} fill className="!h-auto max-w-xs mx-auto !relative max-sm:!w-52" />
                        }
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex gap-3 justify-center">
                            <FaCcStripe size={50} className="max-sm:w-10" />
                            <FaCcPaypal size={50} className="max-sm:w-10" />
                            <FaCcVisa size={50} className="max-sm:w-10" />
                            <FaCcAmex size={50} className="max-sm:w-10" />
                            <FaCcMastercard size={50} className="max-sm:w-10" />
                            <FaGooglePay size={50} className="max-sm:w-10" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-3 mb-5 max-sm:text-[8px]">
                {
                    Object.keys(footerLinks.footer_links).map(key => <h3 key={key} className="inline font-bold"><Link href={footerLinks.footer_links[key]}>{key}</Link></h3>)
                }
                {/* <h3 className="inline font-bold"><Link href="/jute-rugs">Jute Rugs</Link></h3> |
                <h3 className="inline font-bold"><Link href="/cotton-rugs">Cotton Rugs</Link></h3> |
                <h3 className="inline font-bold"><Link href="/jute-hand-bags">Jute Hand Bags</Link></h3> |
                <h3 className="inline font-bold"><Link href="/pillow-and-cushion-covers">Cushion Covers &amp; Pillow Covers</Link></h3> */}
            </div>
        </div>
    )
}

export default FooterMid