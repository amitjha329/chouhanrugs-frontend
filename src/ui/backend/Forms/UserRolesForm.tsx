'use client'
import updateUserRoles from '@/lib/actions/updateUserRoles'
import UserProfileDataModel from '@/lib/types/UserProfileDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Listbox } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import React, { FormEventHandler } from 'react'
import { BiChevronDown } from 'react-icons/bi'

const UserRolesForm = ({ userData }: { userData?: UserProfileDataModel }) => {
    const router = useRouter()
    const [userEditingSelectedRoles, setUserEditinSelectedRoles] = React.useState<string[]>(userData?.roles ?? [])

    const handleRoleUpdateForm: FormEventHandler = (e) => {
        e.preventDefault()
        updateUserRoles(userData?._id ?? "", userEditingSelectedRoles).then(res => {
            if (res.ack) {
                onPageNotifications("success", "Roles Updated").then(() => {
                    router.back()
                    router.refresh()
                })
            } else {
                onPageNotifications("error", "Roles Update Failed, Check Log For Details.")
                console.error(res.result)
            }

        }).catch((err) => {
            console.error(err)
            onPageNotifications("error", `Error: ${err.code}, Message: ${err.message}`)
        })
    }
    return (
        <>
            <div className="mt-2">
                <form className='form-control space-y-3' id='role_manage_form' onSubmit={handleRoleUpdateForm}>
                    <Listbox value={userEditingSelectedRoles} onChange={setUserEditinSelectedRoles} multiple as={React.Fragment}>
                        <Listbox.Button className="input input-bordered w-full relative">
                            {userEditingSelectedRoles.length > 0 && (
                                <ul className='flex flex-row gap-3'>
                                    {userEditingSelectedRoles.map((role,index) => (
                                        <li key={role+index} className="bg-blue-400 !rounded-md px-3 text-primary-content" onClick={() => setUserEditinSelectedRoles(userEditingSelectedRoles.filter(r => r != role))}>{role}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="pointer-events-none absolute right-0 top-3 flex items-center pr-2">
                                <BiChevronDown
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                        </Listbox.Button>
                        <Listbox.Options className="flex items-start gap-3 flex-row px-7 py-3 border-b border-l border-r">
                            {["user", "admin", "editor", "lister"].map((role) => (
                                <Listbox.Option key={role} value={role} className="!rounded-md bg-gray-400 text-primary-content px-3">
                                    {role}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Listbox>
                </form>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    form='role_manage_form'
                >
                    Update
                </button>
                <button
                    type="button"
                    className="join-item btn btn-outline btn-error"
                    onClick={e => router.back()}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default UserRolesForm