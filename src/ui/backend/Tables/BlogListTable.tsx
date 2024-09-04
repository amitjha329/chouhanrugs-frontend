'use client'
import deleteMultiplePostWithId from '@/lib/actions/deleteMultiplePostWithId';
import deletePostWithId from '@/lib/actions/deletePostWithId';
import generateNewBlogPost from '@/lib/actions/generateNewBlogPost';
import getBlogPostsList from '@/lib/actions/getBlogPostsList';
import BlogDataModel from '@/lib/types/BlogDataModel';
import convertTimestamp from '@/lib/utilities/convertTimeStamp';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { PuffLoader } from 'react-spinners';

const BlogListTable = () => {
    const router = useRouter()
    const [blogList, setBlogList] = useState<BlogDataModel[]>([])
    const [blogsLoading, setblogsLoading] = useState(true)
    const [selectedRows, setSelectedRows] = useState<BlogDataModel[]>([]);
    const [toggleCleared, setToggleCleared] = useState(false);

    const handleRowSelected = useCallback((selected: {
        allSelected: boolean;
        selectedCount: number;
        selectedRows: BlogDataModel[];
    }) => {
        setSelectedRows(selected.selectedRows);
    }, []);

    const contextActions = useMemo(() => {
        const handleDelete = () => {

            if (window.confirm(`Are you sure you want to delete ${selectedRows.length} blog posts?`)) {
                const blogsPermalink: string[] = []
                selectedRows.forEach(item => {
                    blogsPermalink.push(item._id)
                })
                console.log(blogsPermalink)
                setToggleCleared(!toggleCleared);
                deleteMultiplePostWithId(blogsPermalink).then(() => { window.location.reload() }).catch(e => console.log(e))
            }
        };

        return (
            <button key="delete" className="p-2 text-white rounded bg-red-400 hover:bg-red-500" onClick={handleDelete}>
                Delete
            </button>
        );
    }, [blogList, selectedRows, toggleCleared]);

    const columns = useMemo(() => [
        {
            name: 'Title',
            selector: (row: BlogDataModel) => row.title,
            sortable: true, // when using custom you should use width or maxWidth, otherwise, the table will default to flex grow behavior
            cell: CustomTitle
        },
        {
            name: 'Posted',
            selector: (row: BlogDataModel) => row.posted,
            wrap: true,
            sortable: true,
            maxWidth: '300px',
            minWidth: "fit-Content",
            format: (row: BlogDataModel) => `${convertTimestamp(row.posted)}`,
        },
        {
            name: 'Image',
            grow: 0,
            cell: BlogPreviewimage
        },
        {
            name: '',
            button: true,
            cell: BlogPreviewlink
        },
        {
            name: '',
            button: true,
            cell: BlogDeleteButton
        },
        {
            name: '',
            button: true,
            cell: BlogEditButton
        }
    ], []);

    useEffect(() => {
        getBlogPostsList().then(blogs => setBlogList(blogs)).catch(e => console.log(e)).finally(() => setblogsLoading(false))
    }, [])

    const SubHeaderComponent = useMemo(() => <>
        <button className='btn btn-outline' onClick={e => {
            generateNewBlogPost().then(result => {
                router.push("/admin/cms/blogs/" + result)
            }).catch(e => console.log(e))
        }}>New Blog Post</button>
    </>, [])


    return (
        <DataTable
            title="All Blogs"
            columns={columns}
            data={blogList}
            progressPending={blogsLoading}
            progressComponent={<PuffLoader />}
            pagination
            responsive
            persistTableHead
            highlightOnHover
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            subHeader
            subHeaderComponent={SubHeaderComponent}
        />
    )
}

const CustomTitle = (row: BlogDataModel) => (
    <div>
        { }
        <div>{row.title}</div>
        <div>
            <div
                data-tag="allowRowEvents"
                style={{ color: 'grey', overflow: 'hidden', whiteSpace: 'pre-wrap', textOverflow: 'ellipses' }}
            >
                { }
                {row.description.slice(0, 50).concat('...')}
            </div>
        </div>
    </div>
);

const BlogPreviewlink = (row: BlogDataModel) => (
    <a href={`/blog/${row.slug}`} target="_blank" className="p-4 m-1 text-center rounded-3xl bg-green-200 hover:bg-green-400 hover:text-white">
        <span>
            View
        </span>
    </a>
)

const BlogDeleteButton = (row: BlogDataModel) => (
    <a href="#" className="p-4 m-1 text-center rounded-3xl bg-red-200 hover:bg-red-400 hover:text-white" onClick={() => { deletePostWithId(row._id).then(() => { window.location.reload() }).catch(e => console.log(e)) }}>
        <span>
            Delete
        </span>
    </a>
)

const BlogEditButton = (row: BlogDataModel) => (
    <Link href={`/admin/cms/blogs/${row._id}`} className="p-4 m-1 text-center rounded-3xl bg-blue-200 hover:bg-blue-400 hover:text-white">
        <span>
            Edit
        </span>
    </Link>
)

const BlogPreviewimage = (row: BlogDataModel) => <Image height={56} width={84} src={row.featuredImage} alt={row.title} />

export default BlogListTable