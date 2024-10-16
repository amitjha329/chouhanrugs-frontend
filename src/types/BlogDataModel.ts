type BlogDataModel = {
    content: string
    description: string
    featuredImage: string
    _id: string
    keywords: string
    posted: number
    updated: number
    title: string
    slug: string
    author: {
        name: string
        username: string
        image?: string
    }
    draft: boolean
}

export default BlogDataModel