import React from 'react'
import getPopUpData from '@/backend/serverActions/getPopUpData'
import GlobalPopup from '@/ui/GlobalPopup'

const GlobalPopupWrapper = async () => {
    const popupData = await getPopUpData()
    
    if (!popupData || !popupData.isActive) {
        return null
    }
    
    return <GlobalPopup popupData={popupData} />
}

export default GlobalPopupWrapper
