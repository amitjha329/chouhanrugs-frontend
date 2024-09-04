'use client'
import deleteShipping from '@/lib/actions/deleteShipping'
import generateNewShipping from '@/lib/actions/generateNewShipping'
import saveShippingActivation from '@/lib/actions/saveShippingActivation'
import ShippingDataModel from '@/lib/types/ShippingDataModel'
import { customStyles } from '@/styles/dataTable'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { FaPencilAlt } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { PuffLoader } from 'react-spinners'

const ShippingListTable = ({ shippingList }: { shippingList: ShippingDataModel[] }) => {
  const router = useRouter()
  const columns = useMemo(() => [
    {
      id: "country",
      name: "Country",
      selector: (row: ShippingDataModel) => row.country,
      sortable: true,
      format: CountryFormat
    },
    {
      id: "shippingRate",
      name: "Shipping Rate",
      selector: (row: ShippingDataModel) => row.shippingCharges,
      sortable: false
    },
    {
      id: "status",
      name: "Status",
      selector: (row: ShippingDataModel) => row.active,
      sortable: true,
      format: ActiveInactive
    },
    {
      id: "action",
      name: "Action",
      button: true,
      minWidth: "300px",
      cell: Actions
    }
  ], [])

  const subHeaderComponent = useMemo(() => {
    return (
      <div className='btn btn-outline' onClick={e => {
        generateNewShipping().then(result => router.push(`/admin/shipping/edit/${result}`)).catch(e => console.log(e))
      }}>Add Shipping</div>
    )
  }, [])
  return (
    <DataTable
      columns={columns}
      data={shippingList}
      customStyles={customStyles}
      responsive
      progressComponent={<PuffLoader />}
      highlightOnHover
      pointerOnHover
      subHeader
      subHeaderComponent={subHeaderComponent}
    />
  )
}

const CountryFormat = (row: ShippingDataModel) => (
  <span className='font-semibold'>{row.country}</span>
)

const ActiveInactive = (row: ShippingDataModel) => (
  <span className={clsx(
    row.active ? 'text-success' : 'text-error',
    'font-semibold'
  )}>{row.active ? "Active" : "Inactive"}</span>
)

const Actions = (row: ShippingDataModel) => {
  return (
    <div className="flex flex-row gap-x-2 items-center">
      <button className='btn btn-outline btn-error btn-sm' onClick={e => {
        deleteShipping(row._id?.toString()).then((res) => {
          if (res.ack) {
            onPageNotifications("success", "Shipping option Deleted").then(() => {
              window.location.reload()
            }).catch(e => console.log(e))
          } else {
            console.log(res.result)
          }
        }).catch(err => console.log(err))
      }}>
        <MdDeleteOutline className='h-4 w-4' />
      </button>
      <Switch
        checked={row.active}
        onChange={e => {
          saveShippingActivation(row._id?.toString() ?? "", e.valueOf()).then((res) => {
            if (res.ack) {
              onPageNotifications("success", "Shipping Activation/Deactivation Success").then(() => {
                window.location.reload()
              }).catch(e => console.log(e))
            } else {
              console.log(res.result)
            }
          }).catch(err => console.log(err))
        }}
        className={`${row.active ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}>
        <span
          className={`${row.active ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      <Link className='btn btn-outline btn-success btn-sm' href={`/admin/shipping/edit/${row._id}`}>
        <FaPencilAlt className='h-4 w-4' />
      </Link>
    </div>
  )
}

export default ShippingListTable