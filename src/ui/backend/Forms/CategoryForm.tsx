'use client'
import deleteImage from '@/lib/actions/deleteImage'
import getCategoriesList from '@/lib/actions/getCategoriesList'
import saveCategoryForm from '@/lib/actions/saveCategoryForm'
import uploadImages from '@/lib/actions/uploadImages'
import CategoriesDataModel from '@/lib/types/CategoriesDataModel'
import ImageUploadResponse from '@/lib/types/ImageUploadResponse'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Combobox, Switch, Transition } from '@headlessui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { Fragment, useState, useEffect } from 'react'
import { BsArrowDownCircle, BsCheckCircle } from 'react-icons/bs'

const CategoryForm = ({ category }: { category: CategoriesDataModel }) => {
    const [categories, setCategories] = useState<CategoriesDataModel[]>([])
    const [categoryName, setCategoryName] = useState(category.name)
    const [categoryDescription, setCategoryDescription] = useState(category.description)
    const [categoryImage, setCategoryImage] = useState<ImageUploadResponse>({
        imgName: "",
        url: category.imgSrc
    })
    const [categoryBanner, setCategoryBanner] = useState<ImageUploadResponse>({
        imgName: "",
        url: category.banner
    })
    const [categoryActive, setCategoryActive] = useState(category.active)
    const [categoryPopular, setCategoryPopular] = useState(category.popular)
    const [parentCategory, setparentCategory] = useState<CategoriesDataModel | undefined>(undefined)
    const [queryCategory, setQueryCat] = useState('')
    const router = useRouter()
    const filteredCategories =
        queryCategory === ''
            ? categories
            : categories.filter((cat) =>
                cat.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(queryCategory.toLowerCase().replace(/\s+/g, ''))
            )

    useEffect(() => {
        getCategoriesList().then(result => setCategories(result)).catch(err => console.log(err))
    }, [])

    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3' id='category_creation_form'>
                    <input className='input input-bordered w-full' placeholder='Category Name' pattern='[A-Za-z0-9\&]' name='category_name' required defaultValue={categoryName} onChange={e => setCategoryName(e.currentTarget.value)} />
                    <input className='input input-bordered w-full' placeholder='Category Description' name='category_desc' required defaultValue={categoryDescription} onChange={e => setCategoryDescription(e.currentTarget.value)} />
                    <Combobox value={parentCategory ?? { name: "No Parent" }} onChange={setparentCategory}>
                        <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden input input-bordered">
                                <Combobox.Input
                                    className="w-full border-none py-2 pl-3 pr-10 h-full leading-5 text-gray-900 focus:ring-0"
                                    displayValue={(category: CategoriesDataModel) => category.name}
                                    onChange={(event) => setQueryCat(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <BsArrowDownCircle
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQueryCat('')}
                            >
                                <Combobox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
                                    <Combobox.Option
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={undefined}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${!parentCategory ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    No Parent
                                                </span>
                                                {!parentCategory ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <BsCheckCircle className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                    {filteredCategories.length === 0 && queryCategory !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                            Nothing found.
                                        </div>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <Combobox.Option
                                                key={category._id}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                    }`
                                                }
                                                value={category}
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                        >
                                                            {category.name}
                                                        </span>
                                                        {selected ? (
                                                            <span
                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                                    }`}
                                                            >
                                                                <BsCheckCircle className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </div>
                    </Combobox>
                    <label>
                        Category Image
                    </label>
                    <input type="file" className='input input-bordered w-full file:!btn file:!btn-outline' placeholder='Category Image' name='category_img' required onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", category._id)
                            formData.append("type", "categories")
                            formData.append("image", fileList)
                            uploadImages(formData).then(result => {
                                if (result[0].url != categoryImage.url && result[0].url != category.imgSrc && !stringEmptyOrNull(categoryImage.url))
                                    deleteImage(categoryImage.url)
                                setCategoryImage(result[0])
                            }).catch(err => console.log(err))
                        }
                    }} />
                    {!stringEmptyOrNull(categoryImage.url) && <Image src={categoryImage.url} alt={categoryName} height={100} width={100} className="aspect-1/1 mx-auto" />}
                    <label>
                        Category Banner (1:1 Ratio or Square Image)
                    </label>
                    <input type="file" className='input input-bordered w-full file:!btn file:!btn-outline' placeholder='Category Image' name='category_img' required onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", category._id)
                            formData.append("type", "categories")
                            formData.append("image", fileList)
                            uploadImages(formData).then(result => {
                                if (result[0].url != categoryBanner.url && result[0].url != category.banner && !stringEmptyOrNull(categoryBanner.url))
                                    deleteImage(categoryBanner.url)
                                setCategoryBanner(result[0])
                            }).catch(err => console.log(err))
                        }
                    }} />
                    {!stringEmptyOrNull(categoryBanner.url) && <Image src={categoryBanner.url} alt={categoryName} height={100} width={100} className="aspect-1/1 mx-auto" />}
                    <div className='flex flex-row items-center justify-center space-x-5'>
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch.Label className="mr-3">Popular</Switch.Label>
                                <Switch
                                    checked={categoryPopular}
                                    onChange={setCategoryPopular}
                                    className={`${categoryPopular ? 'bg-blue-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                    <span
                                        className={`${categoryPopular ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                            </div>
                        </Switch.Group>
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch.Label className="mr-3">Active</Switch.Label>
                                <Switch
                                    checked={categoryActive}
                                    onChange={setCategoryActive}
                                    className={`${categoryActive ? 'bg-blue-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                    <span
                                        className={`${categoryActive ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                            </div>
                        </Switch.Group>
                    </div>
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    onClick={e => {
                        let parent: string | undefined = undefined
                        if (!stringEmptyOrNull(parentCategory?.parent) || !stringEmptyOrNull(parentCategory?.name)) {
                            parent = (parentCategory?.parent ?? "") + `${parentCategory?.name}>`
                        }
                        saveCategoryForm({ _id: category._id, active: categoryActive, banner: categoryBanner.url, description: categoryDescription, imgSrc: categoryImage.url, name: categoryName, popular: categoryPopular, parent }).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Category Information Updated/Added").then(() => {
                                    if (categoryImage.url != category.imgSrc && !stringEmptyOrNull(category.imgSrc))
                                        deleteImage(category.imgSrc).then(_ => router.back()).catch(err => console.log(err))
                                    else
                                        router.back()
                                    if (categoryBanner.url != category.banner && !stringEmptyOrNull(category.banner))
                                        deleteImage(category.banner).then(_ => router.back()).catch(err => console.log(err))
                                    else
                                        router.back()
                                }).catch(err => console.log(err))
                            } else {
                                console.log(res.result)
                            }
                        }).catch(err => console.log(err))
                    }}
                >Update
                </button>
                <button
                    type="button"
                    className="join-item btn btn-outline btn-error"
                    onClick={e => { router.back() }}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default CategoryForm