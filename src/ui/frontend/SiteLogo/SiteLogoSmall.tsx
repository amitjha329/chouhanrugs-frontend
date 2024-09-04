import SiteDataModel from '@/lib/types/SiteDataModel'
import Image from 'next/image'

const SiteLogoSmall = ({ siteData }: { siteData: SiteDataModel }) => {
    return (
        siteData.isTitle ? (
            <div className="flex items-center flex-grow">
                <Image
                    src={siteData.logoSrc}
                    height={32} width={32}
                    className="mr-3"
                    alt="Site Logo"
                    priority
                />
                <span className="self-center text-xs font-semibold whitespace-nowrap dark:text-white">
                    {siteData.title}
                </span>
            </div>
        ) : (
            <div className="flex items-center flex-grow">
                <Image
                    src={siteData.logoSrc}
                    height={20} width={140}
                    className="mr-3"
                    alt="Site Logo"
                    priority
                />
            </div>
        )
    )
}

export default SiteLogoSmall