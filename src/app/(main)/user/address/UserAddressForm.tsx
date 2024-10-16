'use client'
import saveUserNewAddressForm from "@/backend/serverActions/saveUserNewAddressForm"
import onPageNotifications from "@/utils/onPageNotifications"
import { Combobox, ComboboxButton, ComboboxInput, Transition } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { Fragment, useMemo, useState, FormEventHandler, Dispatch, SetStateAction } from "react"
import { BsCaretDown } from "react-icons/bs"
import { MdCheckCircleOutline } from "react-icons/md"
import countryList from "react-select-country-list"

const UserAddressForm = ({ addAddressHandler }: {
    addAddressHandler: Dispatch<SetStateAction<boolean>>
}) => {
    const { data: session } = useSession()
    const countries = useMemo(() => countryList().getData(), [])
    const [selectedCountry, setselectedCountry] = useState(countries[0])
    const [query, setQuery] = useState('')
    const filteredCountries = query === '' ? countries : countries.filter((country) => country.label.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')))
    const [email, setemail] = useState(session?.user?.email ?? "")
    const [firstName, setFName] = useState(session?.user?.name?.split(' ')[0] ?? "")
    const [lastName, setLName] = useState(((session?.user?.name?.split(' ')?.length ?? 0) > 2 ? session?.user?.name?.split(' ').slice(1).join(' ') : session?.user?.name?.split(' ')[1]) ?? "")
    const [streetAddress, setstreetAddress] = useState("")
    const [state, setstate] = useState("")
    const [city, setcity] = useState("")
    const [zip, setzip] = useState("")

    const handleAddressAddForm: FormEventHandler = (e) => {
        e.preventDefault()
        saveUserNewAddressForm({
            _id: "",
            fname: firstName,
            lname: lastName,
            email: email,
            streetAddress: streetAddress,
            city: city,
            state: state,
            country: selectedCountry.label,
            postalCode: zip,
            active: true,
            userId: (session?.user as { id: string }).id
        }).then(res => {
            if (res.ack) {
                onPageNotifications("success", "Address Added").then(_ => window.location.reload()).catch(e => console.log(e))
            } else {
                console.log(res.result)
            }
        }).catch(err => console.log(err))
    }

    return (
        <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 rounded-lg overflow-hidden">
                <div className="hidden md:block md:col-span-1 bg-gray-200">
                    <div className="px-4 sm:p-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-700">Address Information</h3>
                        <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                    </div>
                </div>
                <div className="md:col-span-2 md:mt-0">
                    <form onSubmit={handleAddressAddForm}>
                        <div className="bg-white px-4 py-5 sm:p-6">
                            <h2 className='block md:hidden text-center font-medium mb-6 text-xl w-full'>Profile Info</h2>
                            <hr className="border-gray-200 block md:hidden" />
                            <div className="grid grid-cols-6 gap-6 mt-8">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm text-gray-600">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        defaultValue={firstName}
                                        onChange={e => setFName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm text-gray-600">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        defaultValue={lastName}
                                        onChange={e => setLName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-4">
                                    <label htmlFor="email-address" className="block text-sm text-gray-600">
                                        Email address
                                    </label>
                                    <input
                                        type="text"
                                        name="email-address"
                                        id="email-address"
                                        autoComplete="email"
                                        defaultValue={email}
                                        onChange={e => setemail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>

                                <div className="col-span-6">
                                    <label htmlFor="email-address" className="block text-sm text-gray-600">
                                        Country
                                    </label>
                                    <Combobox value={selectedCountry} onChange={setselectedCountry}>
                                        <div className="relative mt-1">
                                            <div className="relative w-full overflow-hidden text-left input input-bordered p-0">
                                                <ComboboxInput
                                                    className="w-full input input-ghost"
                                                    displayValue={(country: any) => country.label}
                                                    onChange={(event) => setQuery(event.target.value)}
                                                />
                                                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <BsCaretDown
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </ComboboxButton>
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
                                </div>

                                <div className="col-span-6">
                                    <label htmlFor="street-address" className="block text-sm text-gray-600">
                                        Street address
                                    </label>
                                    <input
                                        type="text"
                                        name="street-address"
                                        id="street-address"
                                        autoComplete="street-address"
                                        defaultValue={streetAddress}
                                        onChange={e => setstreetAddress(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label htmlFor="city" className="block text-sm text-gray-600">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        defaultValue={city}
                                        onChange={e => setcity(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label htmlFor="region" className="block text-sm text-gray-600">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        autoComplete="address-level1"
                                        defaultValue={state}
                                        onChange={e => setstate(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm text-gray-600">
                                        ZIP / Postal code
                                    </label>
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        defaultValue={zip}
                                        onChange={e => setzip(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm input"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-300 px-4 py-3 text-right sm:px-6">
                            <button
                                type="button"
                                onClick={_ => addAddressHandler(false)}
                                className="btn btn-outline mr-5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary text-white"
                            >
                                Save Address
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserAddressForm