// @ts-nocheck
'use client'
import saveUserNewAddressForm from "@/backend/serverActions/saveUserNewAddressForm"
import updateUserAddress from "@/backend/serverActions/updateUserAddress"
import onPageNotifications from "@/utils/onPageNotifications"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { Fragment, useMemo, useState, FormEventHandler, Dispatch, SetStateAction, useEffect } from "react"
import { BsCaretDown } from "react-icons/bs"
import { MdCheckCircleOutline } from "react-icons/md"
import countryList from "react-select-country-list"
import UserAddressDataModel from "@/types/UserAddressDataModel"

const UserAddressFormForList = ({ 
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

    // Pre-populate form when editing, clear when adding new
    useEffect(() => {
        if (editingAddress) {
            // Editing mode - populate with existing data
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
        } else {
            // Add mode - clear form and use defaults
            setFName(session?.user?.name?.split(' ')[0] ?? "")
            setLName(((session?.user?.name?.split(' ')?.length ?? 0) > 2 ? session?.user?.name?.split(' ').slice(1).join(' ') : session?.user?.name?.split(' ')[1]) ?? "")
            setemail(session?.user?.email ?? "")
            setstreetAddress("")
            setcity("")
            setstate("")
            setzip("")
            setselectedCountry(countries[0])
        }
    }, [editingAddress, countries, session])

    const handleAddressForm: FormEventHandler = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Validate session
        if (!session?.user?.id) {
            onPageNotifications("error", "Please login to save address")
            setIsSubmitting(false)
            return
        }

        console.log('Form submission started', { 
            isEditing, 
            editingAddress, 
            session: session?.user,
            formData: {
                firstName,
                lastName,
                email,
                streetAddress,
                city,
                state,
                country: selectedCountry.label,
                zip
            }
        })

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

        console.log('Address data to submit:', addressData)

        try {
            const result = isEditing 
                ? await updateUserAddress(addressData)
                : await saveUserNewAddressForm(addressData)

            console.log('Server response:', result)

            if (result.ack) {
                const message = isEditing ? "Address Updated Successfully" : "Address Added Successfully"
                onPageNotifications("success", message)
                    .then(() => {
                        console.log('Calling onSaveComplete...')
                        // Refresh the address list from server
                        if (onSaveComplete) {
                            onSaveComplete()
                        } else {
                            // Fallback: reload the page if callback not provided
                            console.log('No onSaveComplete callback, reloading page...')
                            window.location.reload()
                        }
                        // Close the form
                        addAddressHandler(false)
                    })
                    .catch(e => {
                        console.log('Notification error:', e)
                        // Even if notification fails, still refresh and close
                        if (onSaveComplete) {
                            onSaveComplete()
                        } else {
                            window.location.reload()
                        }
                        addAddressHandler(false)
                    })
            } else {
                onPageNotifications("error", isEditing ? "Failed to update address" : "Failed to add address")
                console.log("Server response:", result.result)
            }
        } catch (err) {
            console.error('Form submission error:', err)
            onPageNotifications("error", "Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mt-6">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                    <h3 className="text-xl font-bold text-base-content">
                        {isEditing ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <p className="mt-1 text-sm text-base-content/70">
                        {isEditing 
                            ? 'Update your address information below.' 
                            : 'Fill in the details to add a new address.'
                        }
                    </p>
                </div>
                
                <form onSubmit={handleAddressForm} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="first-name" className="block text-sm font-medium text-base-content mb-2">
                                First name
                            </label>
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={e => setFName(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-medium text-base-content mb-2">
                                Last name
                            </label>
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={e => setLName(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label htmlFor="email-address" className="block text-sm font-medium text-base-content mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email-address"
                                id="email-address"
                                autoComplete="email"
                                value={email}
                                onChange={e => setemail(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label htmlFor="country" className="block text-sm font-medium text-base-content mb-2">
                                Country
                            </label>
                            <Combobox value={selectedCountry} onChange={v => setselectedCountry(v ? v : countries[0])}>
                                <div className="relative">
                                    <ComboboxInput
                                        className="input input-bordered w-full bg-base-200 focus:bg-base-100 pr-10"
                                        displayValue={(country: any) => country.label}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <BsCaretDown className="h-5 w-5 text-base-content/60" aria-hidden="true" />
                                    </ComboboxButton>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        afterLeave={() => setQuery('')}
                                    >
                                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-base-100 py-1 shadow-lg ring-1 ring-base-300 focus:outline-none">
                                            {filteredCountries.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none py-2 px-4 text-base-content/70">
                                                    Not a country.
                                                </div>
                                            ) : (
                                                filteredCountries.map((country) => (
                                                    <ComboboxOption
                                                        key={country.value}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-lg mx-1 ${active ? 'bg-primary text-primary-content' : 'text-base-content'}`
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
                        
                        <div className="md:col-span-2">
                            <label htmlFor="street-address" className="block text-sm font-medium text-base-content mb-2">
                                Street address
                            </label>
                            <input
                                type="text"
                                name="street-address"
                                id="street-address"
                                autoComplete="street-address"
                                value={streetAddress}
                                onChange={e => setstreetAddress(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-base-content mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                autoComplete="address-level2"
                                value={city}
                                onChange={e => setcity(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-base-content mb-2">
                                State / Province
                            </label>
                            <input
                                type="text"
                                name="region"
                                id="region"
                                autoComplete="address-level1"
                                value={state}
                                onChange={e => setstate(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="postal-code" className="block text-sm font-medium text-base-content mb-2">
                                ZIP / Postal code
                            </label>
                            <input
                                type="text"
                                name="postal-code"
                                id="postal-code"
                                autoComplete="postal-code"
                                value={zip}
                                onChange={e => setzip(e.target.value)}
                                className="input input-bordered w-full bg-base-200 focus:bg-base-100"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-base-300">
                        <button
                            type="button"
                            onClick={() => addAddressHandler(false)}
                            className="btn btn-outline btn-neutral"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary text-primary-content ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting 
                                ? (isEditing ? 'Updating...' : 'Saving...') 
                                : (isEditing ? 'Update Address' : 'Save Address')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserAddressFormForList
