import Image from "next/image";
import { redirect } from "next/navigation";
import banner from "./banner.jpg"
import banner_mobile from "./banner-mobile.jpg"
import getSiteData from "@/backend/serverActions/getSiteData";
import SigninForm from "./SigninForm";
import { auth } from "@/auth";

const SignIn = async () => {
    const session = await auth()
    if (session != null) {
        redirect('/')
    }
    const siteInfo = await getSiteData()
    return (
        <div className="h-screen w-full text-gray-900 max-sm:flex max-sm:flex-col">
            <Image fill src={banner} alt="Banner SignIn" className="-z-20 max-sm:hidden" />
            <Image fill src={banner_mobile} alt="Banner SignIn" className="-z-20 sm:hidden !relative rounded-b-3xl overflow-hidden" />
            <div className="flex">
                <div className="sm:basis-2/3 h-screen max-sm:hidden"></div>
                <div className="sm:basis-1/3 sm:h-screen max-sm:w-screen flex flex-col items-center justify-center">
                    <div className='flex flex-col items-center justify-center'>
                        <Image
                            src={siteInfo.logoSrc}
                            alt={siteInfo.title}
                            className="!relative max-sm:!h-20 !w-auto mt-5"
                            fill
                        />
                        {
                            siteInfo.isTitle && <h1 className="text-lg text-center sm:text-left font-extrabold">
                                {siteInfo.title}
                            </h1>
                        }
                    </div>
                    <SigninForm siteTitle={siteInfo.title} />
                </div>
            </div>
        </div>
    );
}

export default SignIn;