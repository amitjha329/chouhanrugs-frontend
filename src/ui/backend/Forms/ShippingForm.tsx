'use client'
import saveShippingForm from '@/lib/actions/saveShippingForm'
import ShippingDataModel from '@/lib/types/ShippingDataModel'
import { getCurrencyGlyphWithCountryISO } from '@/lib/utilities/currencySelector'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Combobox, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import React, { Fragment, useMemo, useState, FormEventHandler } from 'react'
import { BsCaretDown } from 'react-icons/bs'
import { MdCheckCircleOutline } from 'react-icons/md'
import countryList from 'react-select-country-list'

const ShippingForm = ({ shippingData }: { shippingData?: ShippingDataModel }) => {
    const router = useRouter()
    const countries = useMemo(() => countryList().getData(), [])
    const [selectedCountry, setselectedCountry] = useState(countries[0])
    const [shippingRate, setShippingRate] = useState(0.0)
    const [query, setQuery] = useState('')
    const filteredCountries =
        query === ''
            ? countries
            : countries.filter((country) =>
                country.label
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )
    const handleFormSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        saveShippingForm(shippingData?._id ?? '', selectedCountry.label, selectedCountry.value, `${getCurrencyGlyphWithCountryISO(selectedCountry.value)} ${shippingRate}`).then(res => {
            if (res.ack) {
                onPageNotifications("success", "Shipping Information Updated/Added").then(() => {
                    router.back()
                }).catch(err => console.log(err))
            } else {
                console.log(res.result)
            }
        }).catch(err => console.log(err))
    }
    return (
        <>
            <div className="mt-2">
                <div className="mt-2">
                    <div className="mt-2">
                        <form className='form-control space-y-3' id='shipping_form' onSubmit={handleFormSubmit}>
                            <Combobox value={selectedCountry} onChange={setselectedCountry}>
                                <div className="relative mt-1">
                                    <div className="relative w-full overflow-hidden text-left input input-bordered p-0">
                                        <Combobox.Input
                                            className="w-full input input-ghost"
                                            displayValue={(country: any) => country.label}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <BsCaretDown
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </Combobox.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        afterLeave={() => setQuery('')}
                                    >
                                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredCountries.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                    Not a country.
                                                </div>
                                            ) : (
                                                filteredCountries.map((country) => (
                                                    <Combobox.Option
                                                        key={country.value}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={country}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {country.label}
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                                            }`}
                                                                    >
                                                                        <MdCheckCircleOutline className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            )}
                                        </Combobox.Options>
                                    </Transition>
                                </div>
                            </Combobox>
                            <input value={shippingRate} onChange={e => setShippingRate(Number(e.currentTarget.value))} className='input input-bordered w-full' placeholder='Shipping Rate' name='shipping_rate' type="number" min={0} step={0.01} required />
                        </form>
                    </div>
                </div>
            </div>
            <div className="mt-5 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    form='shipping_form'
                >
                    Update
                </button>
                <button
                    type="button"
                    className="join-item btn btn-outline btn-error"
                    onClick={e => router.back()}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default ShippingForm