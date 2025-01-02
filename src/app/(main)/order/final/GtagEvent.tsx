'use client'
import React, { useEffect } from 'react'

const GtagEvent = () => {
    useEffect(() => {
        window.onload = ((e) => {
            //@ts-ignore
            gtag('event', 'conversion', {
                'send_to': 'AW-16522702647/dNepCKjohv8ZELfe0cY9',
                'transaction_id': ''
            });
        })
    }, [])
    return <></>
}

export default GtagEvent