"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useCallback, useEffect, useRef, useState } from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export type NotificationProduct = {
    name: string
    url: string
    image: string
}

/* ------------------------------------------------------------------ */
/*  Static Data                                                       */
/* ------------------------------------------------------------------ */
const FIRST_NAMES = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
    "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Lisa", "Daniel", "Nancy",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Steven", "Ashley",
    "Andrew", "Kimberly", "Emily", "Joshua", "Donna", "Kenneth", "Michelle", "Kevin",
    "Dorothy", "Brian", "Carol", "George", "Amanda", "Timothy", "Melissa", "Ronald",
    "Deborah", "Jason", "Stephanie", "Ryan", "Rebecca", "Jacob", "Sharon", "Gary",
    "Laura", "Nicholas", "Cynthia", "Eric", "Kathleen", "Jonathan", "Amy", "Stephen",
    "Angela", "Larry", "Shirley", "Justin", "Anna", "Scott", "Brenda", "Brandon",
]

const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
    "Mitchell", "Carter", "Roberts", "Turner", "Phillips", "Evans", "Collins", "Stewart",
]

const US_STATES = [
    "California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio",
    "Georgia", "North Carolina", "Michigan", "New Jersey", "Virginia", "Washington",
    "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri", "Maryland",
    "Wisconsin", "Colorado", "Minnesota", "South Carolina", "Alabama", "Louisiana",
    "Kentucky", "Oregon", "Oklahoma", "Connecticut", "Utah", "Nevada", "Iowa",
]

const TIME_AGO_OPTIONS = [
    "just now",
    "1 minute ago",
    "2 minutes ago",
    "3 minutes ago",
    "5 minutes ago",
    "8 minutes ago",
    "12 minutes ago",
    "15 minutes ago",
    "20 minutes ago",
    "25 minutes ago",
    "32 minutes ago",
    "45 minutes ago",
    "1 hour ago",
    "2 hours ago",
    "3 hours ago",
    "4 hours ago",
    "5 hours ago",
    "6 hours ago",
    "7 hours ago",
    "8 hours ago",
    "9 hours ago",
    "10 hours ago",
    "11 hours ago",
    "12 hours ago",
    "13 hours ago",
    "14 hours ago",
    "15 hours ago",
    "16 hours ago",
    "17 hours ago",
    "18 hours ago",
    "19 hours ago",
    "20 hours ago",
    "21 hours ago",
    "22 hours ago",
    "23 hours ago",
    "24 hours ago",
    "2 days ago",
    "3 days ago",
    "4 days ago",
    "5 days ago",
    "6 days ago",
    "1 week ago"
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateNotification(products: NotificationProduct[]) {
    const firstName = pickRandom(FIRST_NAMES)
    const lastName = pickRandom(LAST_NAMES)
    const state = pickRandom(US_STATES)
    const product = pickRandom(products)
    const timeAgo = pickRandom(TIME_AGO_OPTIONS)

    return {
        id: Date.now(),
        name: `${firstName} ${lastName.charAt(0)}.`,
        location: state,
        product,
        timeAgo,
    }
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
type Notification = ReturnType<typeof generateNotification>

const SHOW_DURATION = 3000       // visible for 3s
const INTERVAL_MIN = 180000       // min 180s between popups
const INTERVAL_MAX = 360000       // max 360s between popups
const INITIAL_DELAY = 7000       // first popup after 7s

export default function PurchaseNotification({ products }: { products: NotificationProduct[] }) {
    const [notification, setNotification] = useState<Notification | null>(null)
    const [visible, setVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showNotification = useCallback(() => {
        if (dismissed || products.length === 0) return
        const notif = generateNotification(products)
        setNotification(notif)
        setVisible(true)

        // Hide after SHOW_DURATION
        timerRef.current = setTimeout(() => {
            setVisible(false)
        }, SHOW_DURATION)
    }, [dismissed, products])

    useEffect(() => {
        // Initial delay before first notification
        const initialTimer = setTimeout(() => {
            showNotification()
        }, INITIAL_DELAY)

        return () => clearTimeout(initialTimer)
    }, [showNotification])

    useEffect(() => {
        // After hiding, schedule the next one
        if (!visible && notification && !dismissed) {
            const delay = INTERVAL_MIN + Math.random() * (INTERVAL_MAX - INTERVAL_MIN)
            const nextTimer = setTimeout(showNotification, delay)
            return () => clearTimeout(nextTimer)
        }
    }, [visible, notification, dismissed, showNotification])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const handleDismiss = () => {
        setVisible(false)
        setDismissed(true)
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    if (!notification) return null

    return (
        <div
            className={`fixed bottom-3 left-3 right-3 z-[9998] transition-all duration-500 ease-out sm:bottom-4 sm:left-4 sm:right-auto ${
                visible
                    ? "translate-y-0 opacity-100 pointer-events-auto"
                    : "translate-y-8 opacity-0 pointer-events-none"
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="relative flex w-full max-w-[15rem] items-start gap-2.5 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl sm:max-w-sm sm:gap-3 sm:p-4">
                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="absolute right-1.5 top-1.5 p-1 text-gray-400 transition-colors hover:text-gray-600 sm:right-2"
                    aria-label="Dismiss notification"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>

                {/* Product thumbnail */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-amber-100 bg-amber-50 sm:h-14 sm:w-14 max-md:hidden">
                    {notification.product.image ? (
                        <Image
                            src={notification.product.image}
                            alt={notification.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-primary/60">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pr-5 sm:pr-4">
                    <p className="text-xs leading-snug text-gray-800 sm:text-sm">
                        <span className="font-semibold">{notification.name}</span>
                        {" from "}
                        <span className="text-gray-600">{notification.location}</span>
                        <span className="max-md:hidden">{" purchased"}</span>
                    </p>
                    <Link
                        href={notification.product.url}
                        className="mt-0.5 block text-xs font-medium text-primary hover:underline sm:text-sm"
                    >
                        <span className="line-clamp-1">{notification.product.name}</span>
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400 sm:text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-4.25a.75.75 0 00-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 000-1.5h-2.5v-3.5z" clipRule="evenodd" />
                        </svg>
                        {notification.timeAgo}
                    </p>
                    {/* Verified badge */}
                    <div className="mt-1.5 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-500">
                            <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-medium text-green-600 sm:text-[11px]">Verified Purchase</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
