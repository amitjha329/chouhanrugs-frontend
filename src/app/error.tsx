"use client"
import React from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="my-8 mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="grid gap-8 sm:grid-cols-2">
                {/* content - start */}
                <div className="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32">
                    <h1 className="text-4xl font-bold text-pink-600 mb-5">
                        OOPS! Temprorary Error
                    </h1>
                    <p className="text-gray-txt mb-5">
                        The page you are looking for is facing some issues at the moment please try after some time.
                    </p>
                    <a
                        href="/"
                        className="bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-full inline-block"
                    >
                        Home page
                    </a>
                </div>
            </div>
        </div>

    )
}