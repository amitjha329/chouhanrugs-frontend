import { auth } from '@/auth'
// import getUserBulkPurchaseRequests from '@/lib/actions/getUserBulkPurchaseRequests'
// import clsx from 'clsx'
import { notFound } from 'next/navigation'
// import Link from 'next/link'
import React from 'react'
// import { BsSendFill } from 'react-icons/bs'

const BulkOrderListPage = async () => {
  const session = await auth()
  // const BulkOrders = await getUserBulkPurchaseRequests((session?.user as { id: string }).id)
  const BulkOrders = []
  return notFound()
  // return (
  //   <div className="basis-full max-sm:max-w-[100vw] lg:basis-3/4">
  //     <div className="mx-auto px-4 sm:px-6">
  //       <div className="container mx-auto my-8 drop-shadow-lg card card-bordered bg-white">
  //         <div className=' card-body min-h-[600px]'>
  //           <div className='card-title'>Your Bulk Orders</div>
  //           <div className='flex flex-col gap-5 flex-wrap'>
  //             {
  //               BulkOrders.length > 0 && BulkOrders.map(BulkOrder => {
  //                 return BulkOrder && <Link key={BulkOrder._id} href={`/user/bulk/${BulkOrder._id}`} className='card flex-row flex-wrap rounded-none card-bordered hover:bg-gray-100'>
  //                   <div className='flex flex-wrap flex-row card-body max-sm:text-sm justify-between items-center'>
  //                     <span><b>Request Id:</b> {BulkOrder._id?.toUpperCase()}</span>
  //                     <span><b>Message:</b> {BulkOrder.message}</span>
  //                     <span><b>Status:</b> <span className={clsx({ "text-error": !BulkOrder.status }, { "text-success": BulkOrder.status })}>{BulkOrder.status ? "Open" : "Closed"}</span></span>
  //                   </div>
  //                   <div className='border-gray-300 border-l text-success max-xl:w-full xl:h-24 xl:aspect-1/1  flex items-center justify-center hover:bg-green-500 max-sm:bg-green-500 max-sm:text-white hover:text-white btn rounded-none'><BsSendFill className='w-7 h-7' /></div>
  //                 </Link>
  //               })
  //             }
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default BulkOrderListPage