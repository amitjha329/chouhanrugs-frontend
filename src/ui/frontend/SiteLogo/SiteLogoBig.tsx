import SiteDataModel from '@/lib/types/SiteDataModel'
import Image from 'next/image'

const SiteLogoBig = ({ siteData }:{siteData:SiteDataModel}) => {
    return (
        siteData.isTitle ? (<div className="flex items-center cursor-pointer">
            <Image src={siteData.logoSrc} alt="Site Logo" height={32} width={32} />
            <span className="ml-2 font-semibold">{siteData.title}</span>
        </div>) : (
            <div className="flex items-center cursor-pointer aspect-[256/41]">
                <Image src={siteData.logoSrc} alt="Site Logo" height={38} width={200} />
            </div>
        )
    )
}

export default SiteLogoBig