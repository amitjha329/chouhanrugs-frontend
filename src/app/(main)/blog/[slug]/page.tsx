import getBlogPostWithSlug from '@/backend/serverActions/getBlogPostWithSlug'
import getSiteData from '@/backend/serverActions/getSiteData'
import generateBlogPostJsonLd from '@/utils/generateBlogPostJsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
    params: Promise<{ slug: string }>;
};
export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const data = await getBlogPostWithSlug(params.slug)
    const dataAdditional = await getSiteData()
    if (data == undefined) return notFound()
    return {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        openGraph: {
            title: data.title,
            description: data.description,
            type: "article",
            publishedTime: new Date(data.posted).toISOString(),
            modifiedTime: new Date(data.updated).toISOString(),
            siteName: dataAdditional.title,
            phoneNumbers: dataAdditional.contact_details.phone.split(','),
            emails: [dataAdditional.contact_details.email],
            images: data.featuredImage,
        },
        twitter: {
            title: data.title,
            card: "summary_large_image",
            description: data.description,
            images: data.featuredImage,
        },
        authors: {
            name: data.author.name,
        }, alternates: {
            canonical: `${dataAdditional.url}blog/${params.slug}`
        }
    }
}

const BlogPostPage = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;
    const [blogData, siteData] = await Promise.all([getBlogPostWithSlug(params.slug), getSiteData()])
    if (blogData == undefined) return notFound()
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={generateBlogPostJsonLd(blogData, siteData)}
                key="blog-jsonld"
            ></script>
            <main className="pb-16 lg:pb-24 pt-8 lg:pt-16 bg-white dark:bg-gray-900">
                {/* <div className='overflow-hidden relative h-80'>
                <Image className='top-0 !w-full !h-auto' src={blogData.featuredImage} alt={blogData.title} fill />
            </div> */}
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
                    <article className="mx-auto w-full max-w-2xl">
                        <header className="mb-4 lg:mb-6 relative">
                            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white z-10">
                                {blogData.title}
                            </h1>
                            <address className="flex items-center mb-6 not-italic">
                                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                    <Image
                                        className="mr-4 rounded-full"
                                        src={blogData.author.image ?? ""}
                                        alt={blogData.author.name}
                                        height={64}
                                        width={64}
                                    />
                                    <div>
                                        <a
                                            href="#"
                                            rel="author"
                                            className="text-xl font-bold text-gray-900 dark:text-white"
                                        >
                                            {blogData.author.name}
                                        </a>
                                        <p className="text-base font-light text-gray-500 dark:text-gray-400">
                                            <time
                                                dateTime="2022-02-08"
                                                title="February 8th, 2022"
                                            >
                                                {new Date(blogData.updated).toLocaleDateString("en", {
                                                    dateStyle: "long"
                                                })}
                                            </time>
                                        </p>
                                    </div>
                                </div>
                            </address>
                            <Image src={blogData.featuredImage} fill alt={blogData.title} className='!relative !w-full !h-auto' />
                        </header>
                        <div dangerouslySetInnerHTML={{ __html: blogData.content }}></div>
                    </article>
                </div>
            </main>
        </>
    )
}

export default BlogPostPage