'use client'
import { Editor } from '@tinymce/tinymce-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useRef, useState, ChangeEventHandler, FormEventHandler } from 'react'
import { useRouter } from 'next/navigation'
import BlogDataModel from '@/lib/types/BlogDataModel'
import uploadImages from '@/lib/actions/uploadImages'
import saveBlogPost from '@/lib/actions/saveBlogPost'
import onPageNotifications from '@/ui/common/onPageNotifications'
import TINY_MCE_KEY from '../../../../tinymce.config'

const NewBlogForm = ({ blogData }: { blogData: BlogDataModel }) => {
    const { data: session } = useSession()
    const router = useRouter()
    const [title, settitle] = useState(blogData.title)
    const [description, setdescription] = useState(blogData.description)
    const [keyword, setkeyword] = useState(blogData.keywords)
    const [slug, setpermalink] = useState(blogData.slug)
    const [featuredImage, setFeaturedImage] = useState<string>(blogData.featuredImage)

    const handleImageAdd: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.files != null) {
            const filesArray = Array.from(e.currentTarget.files)
            const data = new FormData()
            data.append("type", "blog")
            data.append("id", blogData._id)
            filesArray.forEach(item => {
                data.append("image", item)
            })
            uploadImages(data)
                .then(img => {
                    setFeaturedImage(img[0].url)
                }).catch(err => console.log(err))
        }
        e.currentTarget.value = ""
    }

    const handleImageSubmit = async (blob: {
        id: () => string;
        name: () => string;
        filename: () => string;
        blob: () => Blob;
        base64: () => string;
        blobUri: () => string;
        uri: () => string | undefined;
    }, progress: (percent: number) => void): Promise<string> => {
        const formData = new FormData();
        formData.append("id", blogData._id)
        formData.append("type", "blog")
        formData.append('image', blob.blob(), blob.filename());
        return (await uploadImages(formData))[0].url
    }

    const handleBlogSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        saveBlogPost({
            id: blogData._id,
            content: editorRef.current.getContent(),
            description,
            draft: false,
            keywords: keyword,
            publish: blogData.draft,
            slug,
            title,
            featuredImage: featuredImage != blogData.featuredImage ? featuredImage : undefined,
            userId: (session?.user as { id: string }).id,
        }).then(response => {
            if (!response.ack) {
                onPageNotifications("error", "Failed To Publish Blog.").catch(err => console.log(err))
                onPageNotifications("warning", `${response.result?.code}`).catch(err => console.log(err))
                console.log(response.result)
                return
            }
            if (response.ack) {
                onPageNotifications("success", "Blog Published").then(() => {
                    router.push("/admin/cms/blogs")
                }).catch(err => console.log(err))
                console.log(response.result.code, response.result.data)
            }
        }).catch(e => console.log(e))
    }

    const editorRef = useRef<any>()
    return (
        <form onSubmit={handleBlogSubmit}>
            <div className="relative z-0 mb-6 mt-10 w-full group">
                <input defaultValue={title} onChange={(e) => { settitle(e.currentTarget.value); setpermalink(e.target.value.toLowerCase().replace(/\s+/g, " ").replace(/[:|\-_\\/[\]{}()=+*&%!@#"'`,.?;]/g, "").split(' ').join('-')) }} type="text" name="blogTitle" id="blogTitle" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="blogTitle" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Blog Title</label>
            </div>
            <Editor
                apiKey={TINY_MCE_KEY}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={blogData.content}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                        'searchreplace', 'table', 'wordcount', 'code'
                    ],
                    toolbar: [
                        'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ',
                        'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | image | code | help'
                    ],
                    file_picker_types: 'image',
                    images_upload_handler: handleImageSubmit,
                    content_style: 'body {font - family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <div className="relative z-0 mt-6 mb-6 w-full group">
                <input type="text" value={slug} onChange={e => setpermalink(e.currentTarget.value)} name="permalink" id="permalink" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="permalink" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Permalink</label>
            </div>
            <div className="relative z-0 mt-6 mb-6 w-full group">
                <input defaultValue={description} onChange={e => setdescription(e.currentTarget.value)} type="text" name="description" id="description" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
            </div>
            <div className="relative z-0 mt-6 mb-6 w-full group">
                <input defaultValue={keyword} onChange={e => setkeyword(e.currentTarget.value)} type="text" name="keywords" id="keywords" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="keywords" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Keywords</label>
            </div>
            <div className="relative z-0 mt-6 mb-6 w-full group">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="featured_image">Featured Image</label>
                <input className="file-input file-input-bordered w-full" onChange={handleImageAdd} id="featured_image" name='featured_image' type="file" />
            </div>
            <div className='relative flex justify-between items-center w-full'>
                {
                    featuredImage && <Image src={featuredImage} alt={title} className='!w-auto !relative !h-28' fill />
                }
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" onClick={() => { }} className="btn btn-secondary ml-4 mb-5">Cancel</button>
        </form>
    )
}

export default NewBlogForm