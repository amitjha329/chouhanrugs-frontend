import getChatWithId from '@/lib/actions/getChatWithId'
import getProductWithId from '@/lib/actions/getProductWithId'
import getUserBulkPurchaseRequestWithId from '@/lib/actions/getUserBulkPurchaseRequestWithId'
import getUserInfo from '@/lib/actions/getUserInfo'
import AuthOpts from '@/lib/adapters/AuthOptions'
import AdminBulkChat from '@/ui/backend/Chat/AdminBulkChat'
import { getServerSession } from 'next-auth'
import React from 'react'

const BulkChatAdminPage = async ({ params }: { params: { id: string } }) => {
    const bulkRequestData = await getUserBulkPurchaseRequestWithId(params.id)
    const session = await getServerSession(AuthOpts)
    const [productData, userData, adminData, chatData] = await Promise.all([getProductWithId(bulkRequestData?.productId ?? ""), getUserInfo(bulkRequestData?.user ?? ""), getUserInfo((session?.user as { id: string }).id), getChatWithId(bulkRequestData?._id ?? "")])
    return (
        <>
            {
                bulkRequestData && <AdminBulkChat bulkRequest={bulkRequestData} chatHistory={chatData.messages} productData={productData} userData={userData} adminData={adminData} />
            }
        </>
    )
}

export default BulkChatAdminPage