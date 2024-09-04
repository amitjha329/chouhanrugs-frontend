'use client'

import getExchangeRate from "@/lib/actions/getExchangeRate";
import saveCurrencyForm from "@/lib/actions/saveCurrencyForm";
import Currency from "@/lib/types/Currency";
import { getCurrencyGlyphWithCountryISO, getCurrencyString } from "@/lib/utilities/currencySelector";
import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { BsCaretDown } from "react-icons/bs";
import { MdCheckCircleOutline } from "react-icons/md";
import countryList from "react-select-country-list";
declare namespace ReactSelectCountries {
    interface CountryData {
        label: string;
        value: string;
    }
}

const CurrencyForm = ({ currency }: { currency: Currency }) => {
    const router = useRouter()
    const countries = useMemo(() => countryList().getData(), [])
    const [selectedCountry, setselectedCountry] = useState(countries[0])
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
    return (
        <>
            <div className="mt-2">
                <div className="mt-2">
                    <div className="mt-2">
                        <form className='form-control space-y-3' id='Currency_form' onSubmit={async e => {
                            getExchangeRate(getCurrencyString(selectedCountry.value)).then(result => {
                                saveCurrencyForm({
                                    _id: currency._id,
                                    country: selectedCountry.label,
                                    ISO: selectedCountry.value,
                                    currency: getCurrencyString(selectedCountry.value),
                                    currencySymbol: getCurrencyGlyphWithCountryISO(selectedCountry.value),
                                    exchangeRates: result.result,
                                    active: false,
                                    default: false
                                })
                            })
                        }}>
                            <Combobox value={selectedCountry} onChange={setselectedCountry}>
                                <div className="relative mt-1">
                                    <div className="relative w-full overflow-hidden text-left input input-bordered p-0">
                                        <Combobox.Input
                                            className="w-full input input-ghost"
                                            displayValue={(country: ReactSelectCountries.CountryData) => country.label}
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
                        </form>
                    </div>
                </div>
            </div>
            <div className="mt-auto btn-group">
                <button
                    type="submit"
                    className="btn btn-outline"
                    form='Currency_form'
                >
                    Add
                </button>
                <button
                    type="button"
                    className="btn btn-outline btn-error"
                    onClick={e => router.back()}
                >
                    Cancel
                </button>
            </div>
        </>
    );
}

export default CurrencyForm;