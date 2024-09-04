import SiteDataModel from "@/lib/types/SiteDataModel"
import clsx from "clsx"
import FooterTop from "./FooterTop"
import FooterBottom from "./FooterBottom"
import FooterMid from "./FooterMid"
import getFooterBg from "@/lib/actions/getFooterBg"


const Footer = async ({ className = undefined, siteData }: { className?: string, siteData: SiteDataModel }) => {
    const footerBg = await getFooterBg()
    return (
        <footer className={clsx(className, "relative mt-32")} >
            <div style={{
                backgroundImage: `url("${footerBg.footer_bg}")`,
                backgroundSize: '100%'
            }} className="-z-10 blur-sm opacity-40 h-full absolute w-full bg-fixed" />
            <FooterTop />
            <FooterMid footerLogo={siteData.logoSrc} siteTitle={siteData.title} addressData={siteData.contact_details} />
            <FooterBottom siteTitle={siteData.title} profiles={siteData.profiles} />
        </footer>
    )
}

export default Footer