import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'
import getSiteData from '@/backend/serverActions/getSiteData'
import getBlogPostsList from '@/backend/serverActions/getBlogPostsList'

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    return {
        title: "Blogs",
        description: "Read The Latest BLogs and News About Chouhan Rugs",
        keywords: "",
        openGraph: {
            title: "Blogs",
            description: "Read The Latest BLogs and News About Chouhan Rugs",
            type: "website",
            siteName: dataAdditional.title,
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: dataAdditional.logoSrc
        },
        twitter: {
            title: "Blogs",
            description: "Read The Latest BLogs and News About Chouhan Rugs",
            card: "summary",
            images: dataAdditional.logoSrc,
        },
        alternates: {
            canonical: `${dataAdditional.url}blog`
        }
    }
}

const BlogListPage = async () => {
    const blogList = await getBlogPostsList()
    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Latest Blogs</h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">Read some of the latest news realted to textile industry and Important News related to Chouhan Rugs.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
                    {
                        Array.isArray(blogList) && blogList.length > 0 && blogList.map(blogItem => {
                            return (
                                <Link href={`/blog/${blogItem.slug}`} key={blogItem._id} >
                                    <div className="bg-white rounded-lg border border-gray-200 shadow-md card card-body">
                                        <figure className="px-3 pt-3 overflow-hidden aspect-square relative rounded-xl">
                                            <Image src={blogItem.featuredImage} alt={blogItem.title} fill />
                                        </figure>
                                        <div className='card-body'>
                                            <div className="flex justify-between items-center mb-5 text-gray-500">
                                                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                                    <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path></svg>
                                                    Article
                                                </span>
                                                <span className="text-sm">{new Date(blogItem.updated).toDateString()}</span>
                                            </div>
                                            <h2 className="card-title cursor-pointer line-clamp-2"><Link href={`/blog/${blogItem.slug}`}>{blogItem.title}</Link></h2>
                                            <p className="mb-5 font-light text-current text-clip line-clamp-4">{blogItem.description}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    {/* <img className="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" />
                                                    <span className="font-medium dark:text-white">
                                                        Jese Leos
                                                    </span> */}
                                                </div>
                                                <Link href={`/blog/${blogItem.slug}`} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline cursor-pointer">
                                                    Read more
                                                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
                {
                    blogList.length == 0 && <h2 className="mb-4 text-3xl text-center lg:text-7xl tracking-tight font-extrabold w-full opacity-50">No Blogs</h2>
                }
            </div>
        </section>
    )
}

export default BlogListPage