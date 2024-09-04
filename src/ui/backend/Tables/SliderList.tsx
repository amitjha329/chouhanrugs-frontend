'use client'
import deleteSlider from '@/lib/actions/deleteSlider'
import generateNewSlider from '@/lib/actions/generateNewSlider'
import getSlidersList from '@/lib/actions/getSlidersList'
import saveSlideActivation from '@/lib/actions/saveSlideActivation'
import SliderDataModel from '@/lib/types/SliderDataModel'
import { customStyles } from '@/styles/dataTable'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { FaPencilAlt } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { PuffLoader } from 'react-spinners'

const SliderList = () => {
    const [sliders, setSliderList] = useState<Array<SliderDataModel>>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const router = useRouter()

    const columns = useMemo(() => [
        {
            id: "slide_id",
            name: "Slider ID",
            selector: (row: SliderDataModel) => row.slideId,
            sortable: true,
        }, {
            id: "slides",
            name: "Slide Count",
            selector: (row: SliderDataModel) => row.images.length,
            sortable: true,
            format: SlideCount
        },
        {
            id: "description",
            name: "Description",
            selector: (row: SliderDataModel) => row.slideDescription,
            sortable: false
        },
        {
            id: "status",
            name: "Status",
            selector: (row: SliderDataModel) => row.active,
            sortable: true,
            format: Status
        },
        {
            id: "action",
            name: "Action",
            button: true,
            minWidth: "300px",
            cell: ActionRow
        }
    ], [])

    const subHeaderComponent = useMemo(() => {
        return (
            <div className='flex gap-2'>
                <div className='btn btn-outline' onClick={e => {
                generateNewSlider().then(res => {
                    router.push(`/admin/cms/sliders/edit/${res}`)
                }).catch(err => console.log(err))
            }}>Add Slider</div>
            </div>
        )
    }, [])

    useEffect(() => {
        getSlidersList().then(result => { setSliderList(result); setIsListLoading(false) }).catch(err => console.log(err))
    }, [])
    return (
        <DataTable
            columns={columns}
            data={sliders}
            customStyles={customStyles}
            defaultSortFieldId="slide_id"
            responsive
            progressPending={isListLoading}
            progressComponent={<PuffLoader />}
            highlightOnHover
            pointerOnHover
            subHeader
            subHeaderComponent={subHeaderComponent}
        />
    )
}

const ActionRow = (row: SliderDataModel) => (
    <div className="flex flex-row gap-x-2 items-center">
        <button className='btn btn-outline btn-error btn-sm' onClick={() => {
            deleteSlider(row._id).then((res) => {
                if (res.ack) {
                    onPageNotifications("success", "Slider Deleted").then(() => {
                        window.location.reload()
                    })
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
                saveSlideActivation(row._id, e.valueOf()).then(() => window.location.reload()).catch(e => console.log(e))
            }}
            className={`${row.active ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span
                className={`${row.active ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
        <Link className='btn btn-outline btn-success btn-sm' href={`/admin/cms/sliders/edit/${row.slideId}`}>
            <FaPencilAlt className='h-4 w-4' />
        </Link>
    </div>
)

const SlideCount = (row: SliderDataModel) => (
    <span className='font-semibold'>{row.images.length}</span>
)

const Status = (row: SliderDataModel) => (
    <span className={clsx(
        row.active ? 'text-success' : 'text-error',
        'font-semibold'
    )}>{row.active ? "Active" : "Inactive"}</span>
)

export default SliderList