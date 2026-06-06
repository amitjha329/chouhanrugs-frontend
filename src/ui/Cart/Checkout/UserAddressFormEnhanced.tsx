// @ts-nocheck
'use client'
import saveUserNewAddressForm from "@/backend/serverActions/saveUserNewAddressForm"
import updateUserAddress from "@/backend/serverActions/updateUserAddress"
import onPageNotifications from "@/utils/onPageNotifications"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from "@headlessui/react"
import { useSession } from '@/lib/auth-client'
import { Fragment, useMemo, useState, FormEventHandler, Dispatch, SetStateAction, useEffect } from "react"
import { BsCaretDown } from "react-icons/bs"
import { MdCheckCircleOutline } from "react-icons/md"
import countryList from "react-select-country-list"
import UserAddressDataModel from "@/types/UserAddressDataModel"

const UserAddressFormEnhanced = ({ 
    addAddressHandler, 
    editingAddress,
    onSaveComplete 
}: {
    addAddressHandler: Dispatch<SetStateAction<boolean>>,
    editingAddress?: UserAddressDataModel | null,
    onSaveComplete?: () => void
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
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isEditing = !!editingAddress

    // Pre-populate form when editing
    useEffect(() => {
        if (editingAddress) {
            setFName(editingAddress.fname)
            setLName(editingAddress.lname)
            setemail(editingAddress.email)
            setstreetAddress(editingAddress.streetAddress)
            setcity(editingAddress.city)
            setstate(editingAddress.state)
            setzip(editingAddress.postalCode)
            
            // Find and set the country
            const country = countries.find(c => c.label === editingAddress.country)
            if (country) {
                setselectedCountry(country)
            }
        }
    }, [editingAddress, countries])

    const handleAddressForm: FormEventHandler = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const addressData: UserAddressDataModel = {
            _id: editingAddress?._id ?? "",
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
        }

        try {
            const result = isEditing 
                ? await updateUserAddress(addressData)
                : await saveUserNewAddressForm(addressData)

            if (result.ack) {
                onPageNotifications("success", isEditing ? "Address Updated Successfully" : "Address Added Successfully")
                    .then(() => {
                        onSaveComplete?.()
                        addAddressHandler(false)
                    })
                    .catch(e => console.log(e))
            } else {
                onPageNotifications("error", isEditing ? "Failed to update address" : "Failed to add address")
                console.log(result.result)
            }
        } catch (err) {
            onPageNotifications("error", "Something went wrong")
            console.log(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputClass = "h-10 w-full rounded-md border border-primary/10 bg-base-100 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
    const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/55"

    return (
        <form onSubmit={handleAddressForm} className="rounded-lg border border-primary/10 bg-base-100 p-4 md:p-5">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-base-content">{isEditing ? 'Edit address' : 'Add delivery address'}</h3>
                <p className="mt-1 text-xs text-base-content/55">{isEditing ? 'Update the saved delivery details.' : 'Add the delivery details for this order.'}</p>
            </div>
            <div className="grid grid-cols-6 gap-3">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className={labelClass}>
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        value={firstName}
                                        onChange={e => setFName(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="last-name" className={labelClass}>
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        value={lastName}
                                        onChange={e => setLName(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-4">
                                    <label htmlFor="email-address" className={labelClass}>
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        name="email-address"
                                        id="email-address"
                                        autoComplete="email"
                                        value={email}
                                        onChange={e => setemail(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="country" className={labelClass}>
                                        Country
                                    </label>
                                    <Combobox value={selectedCountry} onChange={v => setselectedCountry(v ? v : countries[0])}>
                                        <div className="relative mt-1">
                                            <div className="relative w-full">
                                                <ComboboxInput
                                                    className={`${inputClass} pr-10`}
                                                    displayValue={(country: any) => country.label}
                                                    onChange={(event) => setQuery(event.target.value)}
                                                />
                                                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <BsCaretDown className="h-5 w-5 text-base-content/60" aria-hidden="true" />
                                                </ComboboxButton>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() => setQuery('')}
                                            >
                                                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-primary/10 bg-base-100 py-1 text-sm shadow-sm focus:outline-none">
                                                    {filteredCountries.length === 0 && query !== '' ? (
                                                        <div className="relative cursor-default select-none py-2 px-4 text-base-content/70">
                                                            Not a country.
                                                        </div>
                                                    ) : (
                                                        filteredCountries.map((country) => (
                                                            <ComboboxOption
                                                                key={country.value}
                                                                className={({ active }) =>
                                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-lg ${active ? 'bg-primary text-primary-content' : 'text-base-content'
                                                                    }`
                                                                }
                                                                value={country}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{country.label}</span>
                                                                        {selected ? (
                                                                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-primary-content' : 'text-primary'}`}>
                                                                                <MdCheckCircleOutline className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </ComboboxOption>
                                                        ))
                                                    )}
                                                </ComboboxOptions>
                                            </Transition>
                                        </div>
                                    </Combobox>
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="street-address" className={labelClass}>
                                        Street address
                                    </label>
                                    <input
                                        type="text"
                                        name="street-address"
                                        id="street-address"
                                        autoComplete="street-address"
                                        value={streetAddress}
                                        onChange={e => setstreetAddress(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label htmlFor="city" className={labelClass}>
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        value={city}
                                        onChange={e => setcity(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label htmlFor="region" className={labelClass}>
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        autoComplete="address-level1"
                                        value={state}
                                        onChange={e => setstate(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label htmlFor="postal-code" className={labelClass}>
                                        ZIP / Postal code
                                    </label>
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        value={zip}
                                        onChange={e => setzip(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>
                        <div className="mt-4 flex flex-col justify-end gap-2 border-t border-base-200 pt-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={_ => {
                                    addAddressHandler(false)
                                }}
                                className="rounded-md border border-base-300 px-4 py-2 text-sm font-semibold text-base-content transition hover:bg-base-200"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition hover:bg-primary/90 disabled:opacity-60"
                                disabled={isSubmitting}
                            >
                                {isSubmitting 
                                    ? (isEditing ? 'Updating...' : 'Saving...') 
                                    : (isEditing ? 'Update Address' : 'Save Address')
                                }
                            </button>
                        </div>
        </form>
    )
}

export default UserAddressFormEnhanced
