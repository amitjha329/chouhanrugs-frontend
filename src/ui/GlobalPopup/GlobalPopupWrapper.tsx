import React from 'react'
import getPopUpData from '@/backend/serverActions/getPopUpData'
import GlobalPopup from '@/ui/GlobalPopup'
import { headers } from 'next/headers'

const GlobalPopupWrapper = async () => {
    // Check if on auth pages - popup should not show there
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const isAuthPage = pathname === '/signin' || pathname === '/login'
    
    if (isAuthPage) {
        return null
    }
    
    const popupData = await getPopUpData()
    
    if (!popupData || !popupData.isActive) {
        return null
    }
    
    return <GlobalPopup popupData={popupData} />
}

export default GlobalPopupWrapper
