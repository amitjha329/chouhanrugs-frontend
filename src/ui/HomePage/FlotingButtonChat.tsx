'use client'
import SiteDataModel from "@/types/SiteDataModel";
import Link from "next/link";
import { useState } from "react";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight, HiXMark } from "react-icons/hi2";

const FloatingButtonChat = ({ siteData }: { className?: string, siteData: SiteDataModel }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse items-center gap-3">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    rounded-full p-4 shadow-lg transition-all duration-300 
                    hover:scale-110 hover:shadow-xl
                    ${isOpen 
                        ? 'bg-base-300 text-base-content rotate-0' 
                        : 'bg-primary text-primary-content'
                    }
                `}
                aria-label={isOpen ? "Close contact options" : "Open contact options"}
            >
                <div className="relative w-6 h-6">
                    {/* Chat Icon */}
                    <HiOutlineChatBubbleLeftRight 
                        size={24} 
                        className={`
                            absolute inset-0 transition-all duration-300
                            ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
                        `}
                    />
                    {/* Close Icon */}
                    <HiXMark 
                        size={24} 
                        className={`
                            absolute inset-0 transition-all duration-300
                            ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
                        `}
                    />
                </div>
            </button>

            {/* WhatsApp Button */}
            <Link
                target="_blank"
                href={`https://wa.me/${siteData.contact_details.whatsapp}`}
                className={`
                    rounded-full p-3 bg-green-500 text-white shadow-lg 
                    transition-all duration-300 hover:scale-110 hover:shadow-xl
                    ${isOpen 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-4 scale-0 pointer-events-none'
                    }
                `}
                style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
                aria-label="Chat on WhatsApp"
            >
                <FaWhatsapp size={20} />
            </Link>

            {/* Email Button */}
            <Link
                href={`mailto:${siteData.contact_details.email}`}
                className={`
                    rounded-full p-3 bg-blue-500 text-white shadow-lg 
                    transition-all duration-300 hover:scale-110 hover:shadow-xl
                    ${isOpen 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-4 scale-0 pointer-events-none'
                    }
                `}
                style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}
                aria-label="Send Email"
            >
                <FaEnvelope size={20} />
            </Link>
        </div>
    );
}

export default FloatingButtonChat;