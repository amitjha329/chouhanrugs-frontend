import { getHomePageShopByRoom } from "@/lib/actions/getPageAdditionalData";
import SectionHeader from "../SectionHeaders";
import Image from "next/image";

const ShopByRoom = async () => {
    const shopByRoomData = await getHomePageShopByRoom()
    return (shopByRoomData?.content[0].content.length ?? 0) > 0 && (
        <section className="container mx-auto hidden lg:block">
            <SectionHeader sectionTitle="Shop By Rooms" buttonVisible={true} sectionButtonLink="#" buttonText="See More" />
            <div className="flex flex-row shadow-md rounded overflow-hidden bg-[#ffc0756e]">
                <div className="basis-1/2 py-7 pl-7 pr-20">
                    <ul className="list-none numbered-list">
                        {
                            shopByRoomData?.content.map(item => (item.content.length > 0 || item.title.length > 0) && <li key={item.id}>
                                <div className="title">{item.title}</div>
                                {item.content}
                            </li>)
                        }
                    </ul>
                </div>
                <div className="basis-1/2 rounded-tl-[150px] overflow-hidden relative" >
                    <Image src={shopByRoomData?.bannerImage ?? ""} sizes="(max-width:1024px) 0vw,(max-width:1500px) 50vw,40.2vw" alt="" className="object-center object-cover !w-full" fill quality={20} />
                </div>
            </div>
        </section>
    )
}

export default ShopByRoom