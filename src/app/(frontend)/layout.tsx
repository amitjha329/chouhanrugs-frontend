import Footer from "@/ui/frontend/Footer/Footer";
import Navigation from "@/ui/frontend/Navigation/Navigation";
import SitePopUp from "@/ui/frontend/SitePopUp";
import { CurrencyProvider, DataConnectionProvider, LocationProvider } from "@/app/providers";
import getSiteData from "@/lib/actions/getSiteData";
import getPopupData from "@/lib/actions/getPopupData";
import getCategoriesList from "@/lib/actions/getCategoriesList";
import FloatingButtonChat from "@/ui/frontend/Chat/FlotingButtonChat";
import NavigationThemed from "@/ui/frontend/Navigation/NavigationThemed";
import SnowFlakes from "@/ui/frontend/Decor/SnowFlake";
import getThemeData from "@/lib/actions/getThemeData";
import Fireworks from "@/ui/frontend/Decor/Fireworks";

export const dynamic = 'force-dynamic';

export default async function FrontEndLayout({ children, modals }: Readonly<{ children: React.ReactNode, modals: React.ReactNode }>) {
    const [siteData, popupData, categories, themeData] = await Promise.all([getSiteData(), getPopupData(), getCategoriesList(), getThemeData()])

    return (
        <DataConnectionProvider>
            <CurrencyProvider>
                <LocationProvider>
                    <div>
                        {
                            themeData.festive != null ? <NavigationThemed queryIndexName={process.env.ALGOLIA_QUERY_INDEX ?? ""} indexName={process.env.ALGOLIA_INDEX ?? ""} siteData={siteData} categoriesData={categories} theme={themeData} /> : <Navigation queryIndexName={process.env.ALGOLIA_QUERY_INDEX ?? ""} indexName={process.env.ALGOLIA_INDEX ?? ""} siteData={siteData} categoriesData={categories} />
                        }
                        <div className="max-sm:mt-[135px] mt-[185px]">
                            {children}
                        </div>
                        {
                            themeData.festive == "christmas" && <SnowFlakes />
                        }
                        {
                            themeData.festive == "newyear" && <Fireworks />
                        }
                        <Footer siteData={siteData} />
                        <SitePopUp popupData={popupData} />
                        <FloatingButtonChat siteData={siteData} />
                    </div>
                    {modals}
                </LocationProvider>
            </CurrencyProvider>
        </DataConnectionProvider>
    )
}