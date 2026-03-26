import { LocalizedField } from "@/lib/resolveLocalized"

type BlogDataModel = {
    content: LocalizedField<string>
    description: LocalizedField<string>
    featuredImage: string
    _id: string
    keywords: LocalizedField<string>
    posted: number
    updated: number
    title: LocalizedField<string>
    slug: LocalizedField<string>
    author: {
        name: string
        username: string
        image?: string
    }
    draft: boolean
}

export default BlogDataModel