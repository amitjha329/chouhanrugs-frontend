import getBulkRequestsList from '@/lib/actions/getBulkRequestsList'
import BulkOrdersTable from '@/ui/backend/Tables/BulkOrdersTable'
import React from 'react'

const AdminBulkOrderList = async () => {
    const bulkData = await getBulkRequestsList()
    return (
        <BulkOrdersTable bulkRequestData={bulkData} />
    )
}

export default AdminBulkOrderList