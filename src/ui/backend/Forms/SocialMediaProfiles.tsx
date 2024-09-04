'use client'
import saveSocialProfilesForm from '@/lib/actions/saveSocialProfilesForm'
import AckResponse from '@/lib/types/AckResponse'
import axiosInstance from '@/lib/utilities/axiosInastances'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import React, { FormEventHandler, useReducer, useState } from 'react'
import { BsDash } from 'react-icons/bs'

type propsTypes = {
    profiles: string[],
}

const STRINGARRAYACTIONS = {
    ADD: "add",
    DELETE: "delete"
}
const SocialMediaProfiles = ({ profiles }: propsTypes) => {
    const handleStringArrayChange = (state: string[], action: { type: string, index?: number }): string[] => {
        switch (action.type) {
            case STRINGARRAYACTIONS.ADD:
                return [...state, ""]
            case STRINGARRAYACTIONS.DELETE:
                return state.filter((_, i) => {
                    return i != action.index
                })
            default:
                return []
        }
    }
    const [profilesNew, setProfilesNew] = useReducer(handleStringArrayChange, profiles)
    const saveSiteGeneral: FormEventHandler = (event) => {
        event.preventDefault()
        const profileArray:string[] = []
        for (const element of Array.from(document.getElementsByClassName("profiles"))) {
            const item = element as HTMLInputElement
            !stringEmptyOrNull(item.value) && profileArray.push(item.value)
        }
        saveSocialProfilesForm(profileArray).then((data) => {
            if (data.ack) {
                onPageNotifications("success", "Social Profile Updated")
            } else {
                if (data.result.code == "NO_DATA") {
                    onPageNotifications("error", "Social Profile Update Failed, No Data Passed.")
                }
                onPageNotifications("error", "Check Log For Details.")
                console.error(data.result)
            }
        }).catch(err => {
            console.error(err)
            onPageNotifications("error", `Error: ${err.code}, Message: ${err.message}`)
        })
    }
    return (
        <form onSubmit={saveSiteGeneral}>
            <div className='card card-bordered card-body'>
                <div className='card-title'>Social Profiles</div>
                <div className='flex flex-col gap-y-3' >
                    {
                        profilesNew.map((profile, index) => {
                            let count = index
                            return (
                                <div className='input-group' key={profile + count}>
                                    <input type="text" defaultValue={profile} maxLength={100} placeholder="Social Profile Link" className='input input-bordered w-full profiles' required />
                                    <div className='btn btn-error shrink-0' onClick={_ => setProfilesNew({ type: STRINGARRAYACTIONS.DELETE, index: index })}><BsDash /></div>
                                </div>
                            )
                        })
                    }
                    <div className='btn btn-outline' onClick={_ => setProfilesNew({ type: STRINGARRAYACTIONS.ADD })}>Add More</div>
                </div>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn'>Save</button>
                </div>
            </div>
        </form>
    )
}

export default SocialMediaProfiles