// @ts-nocheck
'use client'
import SiteDataModel from "@/types/SiteDataModel";
import Link from "next/link";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

const FloatingButtonChat = ({ siteData }: { className?: string, siteData: SiteDataModel }) => {
    return (
        <>
            {/* WhatsApp Button - Left */}
            <Link
                target="_blank"
                href={`https://wa.me/${siteData.contact_details.whatsapp}`}
                className="rounded-full p-4 bg-primary text-primary-content shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl fixed bottom-6 left-4 z-[9999]"
                aria-label="Chat on WhatsApp"
            >
                <FaWhatsapp size={24} />
            </Link>

            {/* Email Button - Right */}
            <Link
                href={`mailto:${siteData.contact_details.email}`}
                className="rounded-full p-4 bg-primary text-primary-content shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl fixed bottom-6 right-8 z-[9999]"
                aria-label="Send Email"
            >
                <FaEnvelope size={24} />
            </Link>
        </>
    );
}

export default FloatingButtonChat;