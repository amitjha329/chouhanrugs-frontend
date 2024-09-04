'use client'
import deleteImage from "@/lib/actions/deleteImage"
import uploadImages from "@/lib/actions/uploadImages"
import ImageUploadResponse from "@/lib/types/ImageUploadResponse"
import fileDrophandler from "@/lib/utilities/fileDrophandler"
import clsx from "clsx"
import Image from "next/image"
import { ChangeEventHandler, DragEventHandler, useEffect, useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"
import { RiDragDropFill } from "react-icons/ri"
import { PuffLoader } from "react-spinners"

const VariationImageSection = ({ productId, title, varImage, color, colorCode, setImagesArray }: { productId: string, color: string, colorCode: string, title: string, varImage: string[], setImagesArray: (images: string[], color: string) => void }) => {
    const [uploadingDraggedFiles, setUploadingDraggedFiles] = useState(false)
    const [imageUrlArray, setImageUrlArray] = useState<Array<ImageUploadResponse>>(varImage.map(img => {
        return {
            url: img,
            imgName: img.split("/").at(-1) ?? ""
        }
    }))
    const [dragginImage, setDraggingImage] = useState<string>("")
    const [rearrangingImages, setRearrangingImages] = useState<boolean>(false)
    const [imageUploader, setImageUploader] = useState(false)
    const dropHandler: DragEventHandler<HTMLLabelElement> = (e) => {
        setUploadingDraggedFiles(false)
        !rearrangingImages && fileDrophandler(e, (fileList) => {
            const data = new FormData()
            data.append("productId", productId)
            fileList.forEach(item => {
                data.append("image", item)
            })
            data.append("type", "products")
            setImageUploader(true)
            uploadImages(data)
                .then(img => {
                    setImageUrlArray([...imageUrlArray, ...img])
                }).catch(err => console.log(err)).finally(() => {
                    setImageUploader(false)
                })
        })
    }
    const handleImageAdd: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.files != null) {
            const filesArray = Array.from(e.currentTarget.files)
            const data = new FormData()
            data.append("productId", productId)
            filesArray.forEach(item => {
                data.append("image", item)
            })
            data.append("type", "products")
            setImageUploader(true)
            uploadImages(data)
                .then(img => {
                    setImageUrlArray([...imageUrlArray, ...img])
                }).catch(err => console.log(err)).finally(() => {
                    setImageUploader(false)
                })
        }
        e.currentTarget.value = ""
    }

    const imgdragover: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
    }

    const imgdragstart: DragEventHandler<HTMLDivElement> = (e) => {
        setDraggingImage(e.currentTarget.id)
        setRearrangingImages(true)
    }

    const imgondrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        const dragImage = imageUrlArray.findIndex((image) => image.imgName == dragginImage);
        const dropImage = imageUrlArray.findIndex(
            (image) => image.imgName == e.currentTarget.id
        );
        const arr = moveItem(dragImage, dropImage);
        setImageUrlArray(arr)
        setRearrangingImages(false)
    }

    const moveItem = (from: number, to: number) => {
        const tempArray = imageUrlArray
        const f = tempArray.splice(from, 1)[0];
        tempArray.splice(to, 0, f);
        return tempArray;
    }

    useEffect(() => {
        setImagesArray(imageUrlArray.map(item => item.url), color)
    }, [imageUrlArray])

    return (
        <div className='card card-bordered card-body shadow-md m-2'>
            <div className='card-title'>{title} <div className={`w-5 h-5`} style={{ backgroundColor: colorCode }}></div></div>
            <div className='text-sm text-primary text-opacity-75 w-full'>
                The image format is .jpg .jpeg .png and a minimum size of 300 x 300 pixels (For optimal images use a minimum size of 700 x 700 pixels and max of 1000 x 1000). Select product photos here. Include minimum 3 attractive photos to make the product more appealing to buyers. The Images should be square and 1:1 in ratio.
            </div>
            <label className={clsx('border border-dashed w-full border-primary border-opacity-50 rounded-2xl justify-center items-center flex flex-col min-h-[9rem]', { "bg-primary bg-opacity-50 pointer": uploadingDraggedFiles })} onDragOver={e => e.preventDefault()} onDrop={dropHandler} onDragEnter={e => !rearrangingImages && setUploadingDraggedFiles(true)} onDragLeave={e => setUploadingDraggedFiles(false)} onClick={e => { uploadingDraggedFiles && e.preventDefault() }}>
                <input type="file" multiple={true} hidden onChange={handleImageAdd} accept="image/png, image/jpeg, image/webp" />
                {
                    imageUrlArray.length == 0 && !imageUploader && <>
                        <RiDragDropFill className='w-24 h-24 pointer-events-none mt-5' />
                        <span className='pointer-events-none'>Click To Upload Select and Upload Images.</span>
                    </>
                }
                {imageUploader ? <PuffLoader className="w-full my-20" /> : <div className='flex flex-row flex-wrap items-center justify-center gap-5 py-5' >
                    {
                        imageUrlArray.map((item, index) => {
                            return (
                                <div draggable onDragOver={imgdragover} onDragStart={imgdragstart} onDrop={imgondrop} id={item.imgName} className='w-36 h-28 border hover:shadow-lg relative hover:scale-105 rounded-lg transition-all' key={item.imgName}>
                                    <figure className='relative h-full'>
                                        <Image src={item.url} alt={`product image ${index + 1}`} fill quality={10} className='rounded-lg !relative' />
                                    </figure>
                                    <AiFillCloseCircle className='absolute w-7 h-7 -top-2 -right-2 text-red-600 z-20 pointer-events-auto' onClick={(e) => {
                                        e.preventDefault()
                                        setImageUrlArray(imageUrlArray.filter(file => file != imageUrlArray[index]))
                                        deleteImage(item.url)
                                    }} />
                                </div>
                            )
                        })
                    }
                </div>}
            </label>
        </div>
    )
}
export default VariationImageSection