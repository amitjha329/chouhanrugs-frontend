'use client'
import Image from 'next/image'
import React, { FormEventHandler, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import UserProfileDataModel from '@/types/UserProfileDataModel'
import uploadImages from '@/backend/serverActions/uploadImages'
import onPageNotifications from '@/utils/onPageNotifications'
import updateUserProfile from '@/backend/serverActions/updateUserProfile'
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineCamera, HiOutlineCheckCircle } from 'react-icons/hi2'

const UserProfileSettings = ({ className, userData }: { className?: string, userData?: UserProfileDataModel }) => {
    const [name, setName] = useState<string>(userData?.name ?? "")
    const [email] = useState<string>(userData?.email ?? "")
    const [number, setNumber] = useState<string>(userData?.number ?? "")
    const [userImageFile, setUserImageFile] = useState<File | Blob | null>()
    const [userImageObjectUrl, setUserImageObjectUrl] = useState<string>(userData?.image ?? "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { update: sessionUpdate } = useSession()

    const profileUpdate: FormEventHandler = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (userImageFile) {
                const formData = new FormData()
                formData.append("type", "userImage")
                formData.append("id", userData?.id ?? "")
                formData.append("image", userImageFile as Blob)
                const response = await uploadImages(formData)
                await updateDetails(response[0].url)
            } else {
                await updateDetails()
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateDetails = async (image?: string) => {
        try {
            const res = await updateUserProfile(userData?.id ?? "", email, name, number, image)
            if (res.ack) {
                await onPageNotifications("success", "Profile Updated Successfully")
                await sessionUpdate({ name, number, email, image })
            } else {
                await onPageNotifications("error", "Error In Updating Profile")
            }
        } catch (err) {
            console.log(err)
            await onPageNotifications("error", "Error In Updating Profile")
        }
    }

    useEffect(() => {
        userImageFile && setUserImageObjectUrl(URL.createObjectURL(userImageFile))
    }, [userImageFile])

    return (
        <div className={className}>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-3">
                    <HiOutlineUser className="w-8 h-8 text-primary" />
                    Profile Settings
                </h1>
                <p className="text-base-content/60 mt-1">Manage your personal information and preferences</p>
            </div>

            <form onSubmit={profileUpdate} className="space-y-6">
                {/* Profile Photo Card */}
                <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="font-semibold text-base-content flex items-center gap-2">
                            <HiOutlineCamera className="w-5 h-5 text-primary" />
                            Profile Photo
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-base-200 ring-4 ring-base-200">
                                    {userImageObjectUrl ? (
                                        <Image
                                            height={112}
                                            width={112}
                                            className="w-full h-full object-cover"
                                            id="photo"
                                            alt="Profile photo"
                                            src={userImageObjectUrl}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <HiOutlineUser className="w-12 h-12 text-base-content/30" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => { setUserImageFile(e.currentTarget.files?.item(0)) }}
                                    />
                                    <HiOutlineCamera className="w-8 h-8 text-white" />
                                </label>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="font-medium text-base-content">{name || 'Your Name'}</h3>
                                <p className="text-sm text-base-content/60">{email}</p>
                                <label className="btn btn-sm btn-outline btn-primary mt-3 gap-2 cursor-pointer">
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => { setUserImageFile(e.currentTarget.files?.item(0)) }}
                                    />
                                    <HiOutlineCamera className="w-4 h-4" />
                                    Change Photo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="font-semibold text-base-content">Personal Information</h2>
                        <p className="text-sm text-base-content/60 mt-0.5">Update your basic profile information</p>
                    </div>
                    <div className="p-6 space-y-5">
                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <HiOutlineUser className="w-4 h-4 text-primary" />
                                    Full Name
                                </span>
                            </label>
                            <input
                                className="input input-bordered w-full focus:input-primary transition-colors"
                                type="text"
                                placeholder="Enter your full name"
                                defaultValue={name}
                                onChange={e => setName(e.target.value)}
                                name="name"
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <HiOutlinePhone className="w-4 h-4 text-primary" />
                                    Phone Number
                                </span>
                            </label>
                            <input
                                className="input input-bordered w-full focus:input-primary transition-colors"
                                type="tel"
                                name="number"
                                placeholder="Enter your phone number"
                                defaultValue={number}
                                onChange={e => setNumber(e.target.value)}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <HiOutlineEnvelope className="w-4 h-4 text-primary" />
                                    Email Address
                                </span>
                                <span className="label-text-alt badge badge-ghost badge-sm">Cannot be changed</span>
                            </label>
                            <input
                                className="input input-bordered w-full bg-base-200/50 cursor-not-allowed"
                                type="email"
                                name="email"
                                value={email}
                                disabled
                            />
                            <label className="label">
                                <span className="label-text-alt text-base-content/50">Contact support to change your email address</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button Section */}
                <div className="bg-base-100 rounded-2xl border border-base-300/50 p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-base-content/60 text-center sm:text-left">
                            Make sure all information is correct before saving.
                        </p>
                        <button
                            type="submit"
                            className="btn btn-primary w-full sm:w-auto min-w-[160px] gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UserProfileSettings