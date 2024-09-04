'use client'
import deleteProduct from '@/lib/actions/deleteProduct'
import duplicateProduct from '@/lib/actions/duplicateProduct'
import generateNewProduct from '@/lib/actions/generateNewProduct'
import productSearchAdmin from '@/lib/actions/productSearchAdmin'
import saveProductActivation from '@/lib/actions/saveProductActivation'
import { ProductDataModel } from '@/lib/types/ProductDataModel'
import capitalize from '@/lib/utilities/capitalize'
import { customStyles } from '@/styles/dataTable'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaCopy, FaEye, FaPencilAlt, FaSearch } from 'react-icons/fa'
import { HiSortDescending } from 'react-icons/hi'
import { MdDeleteOutline } from 'react-icons/md'
import { PuffLoader } from 'react-spinners'
import { IoClose, IoReload } from 'react-icons/io5'
import BrandDataModel from '@/lib/types/BrandDataModel'
import CategoriesDataModel from '@/lib/types/CategoriesDataModel'
import createQueryString from '@/lib/utilities/queryParamGenerator'

const ProductsList = ({ totalProducts, initialProducts, currentPage, brandsList, categoriesList }: { totalProducts: number, initialProducts: ProductDataModel[], currentPage: number, brandsList: BrandDataModel[], categoriesList: CategoriesDataModel[] }) => {
    const router = useRouter()
    const [productListItems, setProductListItems] = useState<Array<ProductDataModel>>([])
    const [isSearching, setIsSearching] = useState(false)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const parseQuery = useCallback(createQueryString.bind(null, searchParams), [searchParams])

    const columns = useMemo(() => [
        {
            id: "image",
            selector: (row: any) => row.images,
            sortable: false,
            maxWidth: "70px",
            format: ProductImagePreview
        },
        {
            id: "added",
            selector: (row: ProductDataModel) => row.addedOn,
            sortable: true,
            omit: true
        },

        {
            id: "score",
            selector: (row: any) => row.score,
            sortable: true,
            omit: true
        },
        {
            id: "product",
            name: "Product Name",
            selector: (row: ProductDataModel) => row.productName,
            sortable: true,
            minWidth:'300px',
            cell: ProductNamePreview
        },
        // {
        //     id: "description",
        //     name: "Description",
        //     selector: (row: ProductDataModel) => row.productDescriptionShort,
        //     sortable: false
        // },
        {
            id: "category",
            name: "Category",
            selector: (row: ProductDataModel) => row.productCategory,
            sortable: false,
            format: (row: ProductDataModel) => (
                capitalize(row.productCategory)
            )
        },
        {
            id: "brand",
            name: "Brand",
            selector: (row: ProductDataModel) => row.productBrand,
            sortable: false
        },
        {
            id: "status",
            name: "Status",
            selector: (row: ProductDataModel) => row.productActive,
            sortable: true,
            maxWidth: "150px",
            format: ProductActivationPreview
        },
        {
            id: "action",
            name: "Actions",
            button: true,
            minWidth: "300px",
            cell: ActionRow
        }
    ], [])

    return (
        <div>
            <div className='flex items-end justify-between'>
                <div className='flex justify-between w-full'>
                    <div className='flex gap-x-5'>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }} className='form-control items-center flex-row'>
                            <input type='text' name='query' id='query' placeholder='Enter Query To Search' defaultValue={query} onChange={e => setQuery(e.currentTarget.value)} className='input input-bordered input-xs mr-3' />
                            <button className='btn btn-outline btn-xs' type='submit' onClick={e => {
                                setIsSearching(true)
                                setLoading(true)
                                productSearchAdmin(query, 0).then(result => {
                                    console.log(result)
                                    setProductListItems(result)
                                    setLoading(false)
                                })
                            }}><FaSearch /></button>

                            {isSearching && <button className='btn btn-outline btn-xs ml-2' type='submit' onClick={e => {
                                setIsSearching(false)
                                setQuery("")
                            }}><IoClose className='h-4 w-4' /></button>}
                        </form>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }} className='form-control items-center flex-row'>
                            <select onChange={e => {
                                router.push(pathname + '?' + parseQuery("brand", e.currentTarget.value))
                            }} className='select select-bordered select-xs'>
                                <option disabled selected>Filter Brand</option>
                                {
                                    brandsList.map(b => <option key={b._id}>{b.name}</option>)
                                }
                            </select>

                            <Link href={"/admin/products/list"} className='btn btn-outline btn-xs ml-2'><IoReload className='h-4 w-4' /></Link>
                        </form>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }} className='form-control items-center flex-row'>
                            <select onChange={e => {
                                router.push(pathname + '?' + parseQuery("category", e.currentTarget.value))
                            }} className='select select-bordered select-xs'>
                                <option disabled selected>Filter Category</option>
                                {
                                    categoriesList.map(b => <option key={b._id}>{b.name}</option>)
                                }
                            </select>

                            <Link href={"/admin/products/list"} className='btn btn-outline btn-xs ml-2'><IoReload className='h-4 w-4' /></Link>
                        </form>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }} className='form-control items-center flex-row'>
                            <select onChange={e => {
                                router.push(pathname + '?' + parseQuery("status", e.currentTarget.value))
                            }} className='select select-bordered select-xs'>
                                <option value={-1}>All</option>
                                <option value={1}>Active</option>
                                <option value={0}>In-Active</option>
                            </select>

                            <Link href={"/admin/products/list"} className='btn btn-outline btn-xs ml-2'><IoReload className='h-4 w-4' /></Link>
                        </form>
                    </div>
                    <div className='btn btn-outline' onClick={() => {
                        generateNewProduct().then(result => router.push('/admin/products/edit/' + result)).catch(err => console.log(err))
                    }}>New Product</div>
                </div>
            </div>
            <DataTable
                className='overflow-x-auto'
                columns={columns}
                data={isSearching ? productListItems : initialProducts}
                customStyles={customStyles}
                responsive
                progressPending={loading}
                progressComponent={<PuffLoader />}
                highlightOnHover
                pointerOnHover
                defaultSortFieldId={isSearching ? "added" : "score"}
                defaultSortAsc={false}
                sortIcon={<HiSortDescending />}
                pagination={isSearching}
            />
            {!isSearching && <div className='flex items-end justify-between'>
                <div className='flex items-center gap-x-5'>
                    Page {currentPage} of {Math.ceil(totalProducts / 10)}
                    <select className='select select-bordered' defaultValue={currentPage} onChange={e => {
                        router.push("?page=" + e.currentTarget.value)
                    }}>
                        {
                            [...Array(Math.ceil(totalProducts / 10))].map((v, i) => {
                                return <option key={`option_${v + 1}`}>{i + 1}</option>
                            })
                        }
                    </select>
                </div>
                <nav aria-label="Pagination" className="join join-horizontal mt-10">
                    <Link href={`?page=${Number(currentPage ?? 2) - 1}`} type="button" className="btn btn-outline join-item">
                        <span className="sr-only">Previous</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                    </Link>
                    {
                        [...Array(Math.ceil(totalProducts / 10))].map((v, i) => Math.ceil(totalProducts / 10) > 10 ? (i < currentPage + 3 && i + 4 >= currentPage && <Link href={`?page=${i + 1}`} key={`page_${i}`} type="button" className={clsx("btn join-item", { "btn-primary": (Number(currentPage ?? 1) - 1) == i }, { "btn-outline": (Number(currentPage ?? 1) - 1) != i })}>{i + 1}</Link>) : <Link href={`?page=${i + 1}`} key={`page_${i}`} type="button" className={clsx("btn join-item", { "btn-primary": (Number(currentPage ?? 1) - 1) == i }, { "btn-outline": (Number(currentPage ?? 1) - 1) != i })}>{i + 1}</Link>)
                    }
                    <Link href={`?page=${Number(currentPage ?? 1) + 1}`} type="button" className="btn btn-outline join-item">
                        <span className="sr-only">Next</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                    </Link>
                </nav>
            </div>}
        </div>
    )
}

const ActionRow = (row: ProductDataModel) => (
    <div className="flex flex-row gap-x-2 items-center">
        <div className="tooltip" data-tip="Delete">
            <button className='btn btn-outline btn-error btn-sm' onClick={() => {
                const confirmation = confirm("Are You Sure you want to delete this products " + row.productName + " ?")
                if (confirmation) {
                    deleteProduct(row._id?.toString()).then((res) => {
                        if (res.ack) {
                            onPageNotifications("success", "Product Deleted").then(() => {
                                window.location.reload()
                            }).catch(e => console.log(e))
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }
            }}>
                <MdDeleteOutline className='h-4 w-4' />
            </button>
        </div>
        <Switch
            checked={row.productActive}
            onChange={e => {
                saveProductActivation(row._id?.toString() ?? "", e.valueOf()).then((res) => {
                    if (res.ack) {
                        onPageNotifications("success", "Product Activation/Deactivation Success").then(() => {
                            window.location.reload()
                        }).catch(e => console.log(e))
                    } else {
                        console.log(res.result)
                    }
                }).catch(err => console.log(err))
            }}
            className={`${row.productActive ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span
                className={`${row.productActive ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
        <Link href={`/admin/products/edit/${row._id}`} className="tooltip" data-tip="Edit">
            <div className='btn btn-outline btn-success btn-sm'>
                <FaPencilAlt className='h-4 w-4' />
            </div>
        </Link>
        <div className='tooltip' data-tip="Duplicate" onClick={() => {
            duplicateProduct(row._id?.toString()).then((res) => {
                if (res.ack) {
                    onPageNotifications("success", "Duplicate Created").then(() => {
                        window.location.reload()
                    }).catch(e => console.log(e))
                } else {
                    console.log(res.result)
                }
            }).catch(err => console.log(err))
        }}>
            <div className='btn btn-outline btn-success btn-sm' onClick={() => { }}>
                <FaCopy className='h-4 w-4' />
            </div>
        </div>
        <Link href={`/products/${row.productURL}`} className='tooltip' data-tip="View" target='_blank'>
            <div className='btn btn-outline btn-success btn-sm'>
                <FaEye className='h-4 w-4' />
            </div>
        </Link>
    </div>
)

const ProductNamePreview = (row: ProductDataModel) => (
    <div className='line-clamp-2 text-wrap w-full'><b>{row.productName}</b></div>
)

const ProductImagePreview = (row: ProductDataModel) => (
    <figure className='py-2 aspect-[2/3] max-h-28'>
        <Image src={row.images[row.productPrimaryImageIndex]} alt={row.productName} height={100} width={66.66} />
    </figure>
)

const ProductActivationPreview = (row: ProductDataModel) => (
    <span className={clsx(
        row.productActive ? 'text-success' : 'text-error',
        'font-semibold'
    )}>{row.productActive ? "Active" : "Inactive"}</span>
)

export default ProductsList