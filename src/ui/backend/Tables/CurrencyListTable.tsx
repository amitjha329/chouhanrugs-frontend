'use client';
import generateNewColor from '@/lib/actions/generateNewColor';
import saveCurrencyActivation from '@/lib/actions/saveCurrencyActivation';
import setDefaultCurrency from '@/lib/actions/setDefaultCurrency';
import Currency from '@/lib/types/Currency';
import { customStyles } from '@/styles/dataTable';
import onPageNotifications from '@/ui/common/onPageNotifications';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { MdDeleteOutline } from 'react-icons/md';

const CurrencyListTable = ({ currencyList }: { currencyList: Currency[] }) => {
    const router = useRouter()
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewColor().then(res => {
                    router.push("/admin/products/colors/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Currency</div>
        )
    }, [])
    const columns = useMemo(() => (
        [
            {
                id: "country",
                name: "Country",
                selector: (row: Currency) => row.country,
                sortable: true,
                format: (row: Currency) => (
                    <span className='font-semibold'>{row.country}</span>
                )
            },
            {
                id: "iso",
                name: "ISO",
                maxWidth: "100px",
                selector: (row: Currency) => row.ISO,
                sortable: false
            },
            {
                id: "currency",
                name: "Currency",
                maxWidth: "100px",
                selector: (row: Currency) => row.currency,
                sortable: false
            },
            {
                id: "symbol",
                name: "symbol",
                maxWidth: "100px",
                selector: (row: Currency) => row.currencySymbol,
                sortable: false
            },
            {
                id: "exch",
                name: "Exchange Rates",
                selector: (row: Currency) => row.exchangeRates,
                sortable: false
            },
            {
                id: "status",
                name: "Status",
                selector: (row: Currency) => row.active,
                maxWidth: "100px",
                sortable: true,
                format: (row: Currency) => (
                    <span className={clsx(
                        row.active ? 'text-success' : 'text-error',
                        'font-semibold'
                    )}>{row.active ? "Active" : "Inactive"}</span>
                )
            },
            {
                id: "action",
                name: "Action",
                button: true,
                minWidth: "400px",
                cell: ActionRow
            }
        ]
    ), [])
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <DataTable
                    columns={columns}
                    data={currencyList}
                    customStyles={customStyles}
                    responsive
                    highlightOnHover
                    pointerOnHover
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                />
            </div>
        </div>
    )
}

const ActionRow = (row: Currency) => (
    <div className="flex flex-row gap-x-2 items-center justify-start">
        {
            !row.default ? (
                <>
                    <button className='btn btn-outline btn-error btn-sm' onClick={e => { }}>
                        <MdDeleteOutline className='h-4 w-4' />
                    </button>
                    <Switch
                        checked={row.active}
                        onChange={e => {
                            saveCurrencyActivation(row._id, e.valueOf()).then(result => {
                                result.ack && onPageNotifications("success", "Currency Updated").then(() => window.location.reload())
                            })
                        }}
                        className={`${row.active ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span
                            className={`${row.active ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                    <button className='btn btn-outline btn-info btn-sm' onClick={async e => {
                        setDefaultCurrency(row._id).then(result => {
                            result.ack && onPageNotifications("success", "Deafult Currency Updated").then(() => window.location.reload())
                        })
                    }}>
                        Default
                    </button>
                </>
            ) : (
                <span className='text-success rounded-full border border-success px-2'>PRIMARY</span>
            )
        }
    </div>
)

export default CurrencyListTable