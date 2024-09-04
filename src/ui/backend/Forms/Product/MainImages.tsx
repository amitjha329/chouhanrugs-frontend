'use client';
import deleteImage from "@/lib/actions/deleteImage";
import saveProductImages from "@/lib/actions/saveProductImages";
import uploadImages from "@/lib/actions/uploadImages";
import ImageUploadResponse from "@/lib/types/ImageUploadResponse";
import fileDrophandler from "@/lib/utilities/fileDrophandler"
import onPageNotifications from "@/ui/common/onPageNotifications";
import { RadioGroup } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"
import { ChangeEventHandler, DragEventHandler, useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai"
import { BsPatchCheckFill } from "react-icons/bs"
import { RiDragDropFill } from "react-icons/ri"
import { PuffLoader } from "react-spinners";

const MainImages = ({ productId, productImages }: { productId: string, productImages: string[] }) => {
    const [uploadingDraggedFiles, setUploadingDraggedFiles] = useState(false)
    const [imageUrlArray, setImageUrlArray] = useState<Array<ImageUploadResponse>>([])
    const [dragginImage, setDraggingImage] = useState<string>("")
    const [rearrangingImages, setRearrangingImages] = useState<boolean>(false)
    const [imageUploader, setImageUploader] = useState(false)
    const dropHandler: DragEventHandler<HTMLLabelElement> = (e) => {
        setUploadingDraggedFiles(false)
        !rearrangingImages && fileDrophandler(e, (fileList) => {
            const data = new FormData()
            data.append("id", productId)
            data.append("type", "products")
            fileList.forEach(item => {
                data.append("image", item)
            })
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
            data.append("id", productId)
            data.append("type", "products")
            filesArray.forEach(item => {
                data.append("image", item)
            })
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
        const arr: Array<ImageUploadResponse> = []
        productImages.forEach(img => {
            arr.push({
                url: img,
                imgName: img.split("/").at(-1) ?? ""
            })
        })
        setImageUrlArray(arr)
    }, [])

    return <div className='card card-bordered card-body shadow-md mb-5'>
        <div className='card-title'>Product Images</div>
        <div className='text-sm text-primary text-opacity-75 w-full'>
            The image format is .jpg .jpeg .png and a minimum size of 300 x 300 pixels (For optimal images use a minimum size of 700 x 700 pixels).
            Select product photos or drag and drop photos here. Include min. 3 attractive photos to make the product more attractive to buyers.
            <span className='font-bold'>&nbsp;Click on any image to set it as Primary,</span>
            <span className='font-bold'>&nbsp;Images can be rearranged drag the image and drop it in place where it needs to be.</span>
        </div>
        <label className={clsx('border border-dashed w-full border-primary border-opacity-50 rounded-2xl justify-center items-center flex flex-col min-h-[9rem]', { "bg-primary bg-opacity-50 pointer": uploadingDraggedFiles })} onDragOver={e => e.preventDefault()} onDrop={dropHandler} onDragEnter={e => !rearrangingImages && setUploadingDraggedFiles(true)} onDragLeave={e => setUploadingDraggedFiles(false)} onClick={e => { uploadingDraggedFiles && e.preventDefault() }}>
            <input type="file" multiple={true} hidden onChange={handleImageAdd} accept="image/png, image/jpeg, image/webp" />
            {
                imageUrlArray.length == 0 && !imageUploader && <>
                    <RiDragDropFill className='w-24 h-24 pointer-events-none mt-5' />
                    <span className='pointer-events-none'>Click To Upload or Drag and Drop Images Here To Upload Them.</span>
                </>
            }
            {imageUploader && <PuffLoader className="w-full my-20" />}
            {
                !imageUploader && <RadioGroup value={0} onChange={(val: number) => {
                    return
                }} onClick={e => e.preventDefault()}>
                    <div className='flex flex-row flex-wrap items-center justify-center gap-5 py-5' >
                        {
                            imageUrlArray.map((imageRes, index) => {
                                return (
                                    <RadioGroup.Option as="div" draggable onDragOver={imgdragover} onDragStart={imgdragstart} onDrop={imgondrop} id={imageRes.imgName} key={imageRes.imgName} value={index} className='w-36 h-28 border hover:shadow-lg relative hover:scale-105 rounded-lg transition-all'>
                                        {({ checked, active }) => (
                                            <>
                                                {checked && <BsPatchCheckFill className='absolute w-7 h-7 -top-2 -left-2 text-green-600 z-20' />}
                                                <figure className='relative h-full'>
                                                    <Image src={imageRes.url} alt={imageRes.imgName} fill quality={10} className='rounded-lg !relative' />
                                                </figure>
                                                <AiFillCloseCircle className='absolute w-7 h-7 -top-2 -right-2 text-red-600 z-20 pointer-events-auto' onClick={(e) => {
                                                    e.preventDefault()
                                                    setImageUrlArray(imageUrlArray.filter(file => file != imageUrlArray[index]))
                                                    deleteImage(imageRes.url)
                                                }} />
                                            </>
                                        )}
                                    </RadioGroup.Option>
                                )
                            })
                        }
                        {/* <div className='w-36 h-28 border hover:shadow-lg relative hover:scale-105 rounded-lg transition-all'>
                        <figure className='relative h-full flex flex-col'>
                            <BsPlus className='h-10 w-10'/>
                            Add More
                        </figure>
                    </div> */}
                    </div>
                </RadioGroup>
            }
        </label>
        <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => {
                const images: Array<string> = []
                imageUrlArray.forEach(img => images.push(img.url))
                saveProductImages(productId, images).then(res => {
                    if (res.ack) {
                        onPageNotifications("success", "Images Updated")
                    } else {
                        console.log(res.result)
                    }
                }).catch(err => console.log(err))
            }}>Save</button>
        </div>
    </div >
}

export default MainImages