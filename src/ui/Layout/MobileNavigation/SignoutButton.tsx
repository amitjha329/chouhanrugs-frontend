'use client'
import { signOut } from 'next-auth/react'
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'

const SignoutButton = () => {
    return (
        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={e => {
            signOut()
        }}>
            <FaSignOutAlt className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="flex-1 ml-3 whitespace-nowrap">Log Out</span>
        </div>
    )
}

export default SignoutButton