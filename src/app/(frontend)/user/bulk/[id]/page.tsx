
import getChatWithId from '@/lib/actions/getChatWithId'
import getProductWithId from '@/lib/actions/getProductWithId'
import getUserBulkPurchaseRequestWithId from '@/lib/actions/getUserBulkPurchaseRequestWithId'
import UserBulkChat from '@/ui/frontend/Chat/UserBulkChat'
import React from 'react'

const BulkOrderChatPage = async ({ params }: { params: { id: string } }) => {
  const bulkRequestData = await getUserBulkPurchaseRequestWithId(params.id)
  const productData = await getProductWithId(bulkRequestData?.productId ?? "")
  const chatData = await getChatWithId(bulkRequestData?._id ?? "")
  return (
    <>
      {
        bulkRequestData && <UserBulkChat bulkRequest={bulkRequestData} chatHistory={chatData.messages} productData={productData} />
      }
    </>
  )
}

export default BulkOrderChatPage