'use client'
import Link from 'next/link'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { MdSupportAgent } from 'react-icons/md'
import { HiOutlineUser } from 'react-icons/hi2'
import { useGoogleAdsConfig } from '@/components/GoogleAdsProvider'
import { trackWhatsAppLead } from '@/lib/gtagConversion'

const MobileBottomNav = ({ whatsapp, email, user }: { whatsapp: string; email: string; user?: { name?: string | null; image?: string | null } | null }) => {
    const googleAdsConfig = useGoogleAdsConfig()

    return (
        <>
            {/* Spacer so page content isn't hidden behind the fixed nav */}
            <div className="h-14 md:hidden" />
            <nav className="fixed bottom-0 left-0 right-0 z-[98] bg-base-100 border-t border-base-300 md:hidden">
            <ul className="flex justify-around items-center h-14">
                <li>
                    <Link
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        onClick={() => trackWhatsAppLead(googleAdsConfig)}
                        className="flex flex-col items-center gap-0.5 text-green-600"
                    >
                        <FaWhatsapp size={20} />
                        <span className="text-[10px]">WhatsApp</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={`mailto:${email}`}
                        className="flex flex-col items-center gap-0.5 text-blue-600"
                    >
                        <FaEnvelope size={18} />
                        <span className="text-[10px]">Email</span>
                    </Link>
                </li>
                <li>
                    {user ? (
                        <Link
                            href="/user/profile"
                            className="flex flex-col items-center gap-0.5 text-base-content"
                        >
                            {user.image ? (
                                <img src={user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                                <HiOutlineUser size={20} />
                            )}
                            <span className="text-[10px]">Profile</span>
                        </Link>
                    ) : (
                        <Link
                            href="/signin"
                            className="flex flex-col items-center gap-0.5 text-base-content"
                        >
                            <HiOutlineUser size={20} />
                            <span className="text-[10px]">Login</span>
                        </Link>
                    )}
                </li>
                <li>
                    <Link
                        href="/contact-us"
                        className="flex flex-col items-center gap-0.5 text-base-content"
                    >
                        <MdSupportAgent size={20} />
                        <span className="text-[10px]">Support</span>
                    </Link>
                </li>
            </ul>
            </nav>
        </>
    )
}

export default MobileBottomNav
