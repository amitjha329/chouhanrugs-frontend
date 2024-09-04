import SliderDataModel from '@/lib/types/SliderDataModel'
import Flicked from './Flicked'
import Image from "next/image"
import PageMetaDataModel from '@/lib/types/PageMetaDataModel'
import clientPromise from '@/lib/mongodb/clientPromise'

async function getSliderData(slideId: number): Promise<SliderDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sliders").findOne({ slideId })
        return JSON.parse(JSON.stringify(data)) as SliderDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const HomeHeroSlider = async ({ pageMeta }: { pageMeta: PageMetaDataModel }) => {
    const slides = await getSliderData(pageMeta.sliderId ?? 1)
    return (
        <div className="w-full h-auto">
            {
                !pageMeta.videoBanner ? (
                    <>
                        {
                            slides.images.length > 1 && <Flicked options={{
                                imagesLoaded: true,
                                wrapAround: true,
                                autoPlay: true,
                                dragThreshold: 10,
                                pauseAutoPlayOnHover: true,
                                pageDots: false,
                                prevNextButtons: false
                            }} className="2xl:h-[750px] overflow-hidden">
                                {
                                    slides?.images?.map(slide => {
                                        return <Image src={slide.src.toString()} alt={slide.title} fill key={slide.title} className="!h-auto" quality={75} priority />
                                    })
                                }
                            </Flicked>
                        }
                        {
                            slides.images.length == 1 && <div className="2xl:h-[750px] overflow-hidden"><Image src={slides.images[0].src.toString()} alt={slides.images[0].title} key={slides.images[0].title} className="!relative !h-auto" quality={75} fill priority /></div>
                        }
                    </>
                ) : <div className='relative w-full aspect-video sm:aspect-none overflow-hidden sm:h-[600px]'>
                    <video autoPlay muted loop id="myVideo" className='min-w-full min-h-full absolute left-0'>
                        <source src={pageMeta.videoPath} type="video/mp4" />
                        Your browser does not support HTML5 video.
                    </video>
                </div>
            }
        </div>

    )
}

export default HomeHeroSlider