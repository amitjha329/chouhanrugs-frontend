'use client'
import Image from 'next/image'
import React, { FormEventHandler, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import UserProfileDataModel from '@/types/UserProfileDataModel'
import uploadImages from '@/backend/serverActions/uploadImages'
import onPageNotifications from '@/utils/onPageNotifications'
import updateUserProfile from '@/backend/serverActions/updateUserProfile'

const UserProfileSettings = ({ className, userData }: { className: string, userData?: UserProfileDataModel }) => {
    const [name, setName] = useState<string>(userData?.name ?? "")
    const [email] = useState<string>(userData?.email ?? "")
    const [number, setNumber] = useState<string>(userData?.number ?? "")
    const [userImageFile, setUserImageFile] = useState<File | Blob | null>()
    const [userImageObjectUrl, setUserImageObjectUrl] = useState<string>(userData?.image ?? "")
    const { update: sessionUpdate } = useSession()

    const profileUpdate: FormEventHandler = (e) => {
        e.preventDefault()
        if (userImageFile) {
            const formData = new FormData()
            formData.append("type", "userImage")
            formData.append("id", userData?.id ?? "")
            formData.append("image", userImageFile as Blob)
            uploadImages(formData).then((response) => {
                updateDetails(response[0].url)
            }).catch((e:any) => console.log(e))
        } else {
            updateDetails()
        }
    }

    const updateDetails = (image?: string) => {
        updateUserProfile(userData?.id ?? "", email, name, number, image).then(res => {
            if (res.ack) {
                onPageNotifications("success", "Profile Updated").catch(e => console.log(e)).finally(() => { sessionUpdate({ name }).catch(e => console.log(e)) })
            } else {
                onPageNotifications("success", "Error In Updating Profile").catch(e => console.log(e))
            }
        }).catch(err => {
            console.log(err)
            onPageNotifications("success", "Error In Updating Profile").catch(e => console.log(e))
        })
    }

    useEffect(() => {
        userImageFile && setUserImageObjectUrl(URL.createObjectURL(userImageFile))
    }, [userImageFile])


    return (
        <section className={className}>
            <div className="mx-auto px-4 sm:px-6">
                <div className="container mx-auto drop-shadow-lg">
                    <form onSubmit={profileUpdate}>
                        {/* @csrf */}
                        <div className="w-full bg-white rounded-lg mx-auto mt-8 flex overflow-hidden rounded-b-none">
                            <div className="w-1/3 bg-gray-200 p-8 hidden md:inline-block">
                                <h2 className="font-medium text-gray-700 mb-4 tracking-wide">
                                    Profile Info
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Update your basic profile information such as Phone Number, Name, and
                                    Image.
                                </p>
                            </div>
                            <div className="md:w-2/3 w-full">
                                <h2 className='block md:hidden text-center font-medium my-6 text-xl w-full'>Profile Info</h2>
                                <hr className="border-gray-200 block md:hidden" />
                                <div className="py-8 px-16">
                                    <label htmlFor="name" className="text-sm text-gray-600">
                                        Name
                                    </label>
                                    <input
                                        className="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-primary input"
                                        type="text"
                                        defaultValue={name}
                                        onChange={e => setName(e.target.value)}
                                        name="name"
                                    />
                                </div>
                                <div className="py-8 px-16">
                                    <label htmlFor="number" className="text-sm text-gray-600">
                                        Phone Number
                                    </label>
                                    <input
                                        className="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-primary input"
                                        type="tel"
                                        name="number"
                                        defaultValue={number}
                                        onChange={e => setNumber(e.target.value)}
                                    />
                                </div>

                                <div className="py-8 px-16">
                                    <label htmlFor="email" className="text-sm text-gray-600">
                                        Email
                                    </label>
                                    <input
                                        className="mt-2 input-disabled border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-primary input"
                                        type="email"
                                        name="email"
                                        value={email}
                                        disabled
                                    />
                                </div>
                                <div className="py-8 px-16">
                                    <label htmlFor="photo" className="text-sm text-gray-600 w-full block">
                                        Photo
                                    </label>
                                    <div className='flex items-center'>
                                        <Image
                                            height={70}
                                            width={64}
                                            className="rounded-full w-16 mt-2 mb-2 aspect-1/1"
                                            id="photo"
                                            alt="photo"
                                            src={userImageObjectUrl}
                                        />
                                        <div className="bg-gray-200 text-gray-500 text-xs ml-5 font-bold px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-gray-600 relative overflow-hidden cursor-pointer">
                                            <input
                                                type="file"
                                                name="photo"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => { setUserImageFile(e.currentTarget.files?.item(0)) }}
                                            />{" "}
                                            Change Photo
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <hr className="hidden md:block border-gray-300" />
                        <div className="w-full bg-white mx-auto flex overflow-hidden rounded-b-none">
                            <div className="w-1/3 bg-gray-200 p-8 hidden md:inline-block">
                                <h2 className="font-medium text-gray-700 mb-4 tracking-wide">
                                    Security
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Update Security Settings For Your Profile. Change Password and Protect Your Account.
                                </p>
                            </div>
                            <div className="md:w-2/3 w-full">
                                <h2 className='block md:hidden text-center font-medium my-6 text-xl w-full'>Change Password</h2>
                                <hr className="border-gray-200" />
                                <div className="py-8 px-16">
                                    <label htmlFor="name" className="text-sm text-gray-600">
                                        Current Password
                                    </label>
                                    <input
                                        className="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-indigo-500"
                                        type="text"
                                        defaultValue=""
                                        name="name"
                                    />
                                </div>
                                <div className="py-8 px-16">
                                    <label htmlFor="number" className="text-sm text-gray-600">
                                        New Password
                                    </label>
                                    <input
                                        className="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-indigo-500"
                                        type="tel"
                                        name="number"
                                        defaultValue=""
                                    />
                                </div>
                                <div className="py-8 px-16">
                                    <label htmlFor="number" className="text-sm text-gray-600">
                                        Confirm New Password
                                    </label>
                                    <input
                                        className="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-indigo-500"
                                        type="tel"
                                        name="number"
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div className="p-16 py-8 bg-gray-300 rounded-b-lg border-t border-gray-200 text-center sm:text-left flex flex-wrap items-center justify-between">
                            <p className="text-sm text-gray-500 tracking-tight mb-4 md:mb-0 mt-2">
                                Click on Update Button to update your Settings.
                            </p>
                            <button
                                type="submit"
                                className="bg-indigo-500 text-white text-sm font-medium px-6 py-2 rounded uppercase cursor-pointer md:w-auto w-full"
                                defaultValue="Save"
                            >Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default UserProfileSettings