import getBlogPostWithId from '@/lib/actions/getBlogPostWithId'
import NewBlogForm from '@/ui/backend/Forms/NewBlogForm'
import React from 'react'

const NewBlogPage = async ({ params }: { params: { blogId: string } }) => {
  const blogData = await getBlogPostWithId(params.blogId)
  return (
    <section className="flex flex-wrap">
      <div className="w-full px-10">
        <NewBlogForm blogData={blogData} />
      </div>
    </section>
  )
}

export default NewBlogPage