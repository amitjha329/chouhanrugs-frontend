'use client'
import AckResponse from '@/lib/types/AckResponse'
import axiosInstance from '@/lib/utilities/axiosInastances'
import onPageNotifications from '@/ui/common/onPageNotifications'
import React, { FormEventHandler, useState } from 'react'

type propsType = {
    flat_house: string,
    address1: string,
    address2: string,
    state: string,
    country: string,
    PIN: string,
    phoneNum: string,
    whatsappNum: string,
    emailAddress: string
}

const SiteContactDetailsForm = ({ PIN, address1, address2, country, emailAddress, flat_house, phoneNum, whatsappNum, state }: propsType) => {
    const [addressFlat, setAddressFlat] = useState(flat_house)
    const [addressBlockOne, setAddressBlockOne] = useState(address1)
    const [addressBlockTwo, setAddressBlockTwo] = useState(address2)
    const [addressState, setAddressState] = useState(state)
    const [addressCountry, setAddressCountry] = useState(country)
    const [addressPIN, setAddressPIN] = useState(PIN)
    const [phone, setPhone] = useState(phoneNum)
    const [whatsapp, setWhatsapp] = useState(whatsappNum)
    const [email, setEmail] = useState(emailAddress)
    const saveContactDetails: FormEventHandler = (event) => {
        event.preventDefault()
        axiosInstance().post('/admin/cms/site/contactoptionsupdate', {
            addressdata: {
                ...(addressFlat != flat_house) && { flat_house: addressFlat },
                ...(addressBlockOne != address1) && { address1: addressBlockOne },
                ...(addressBlockTwo != address2) && { address2: addressBlockTwo },
                ...(addressState != state) && { state: addressState },
                ...(addressCountry != country) && { country: addressCountry },
                ...(addressPIN != PIN) && { PIN: addressPIN },
                ...(email != emailAddress) && { email: email },
                ...(phone != phoneNum) && { phone: phone },
                ...(whatsapp != whatsappNum) && { whatsapp: whatsapp }
            }
        }).then(({ data }: { data: AckResponse }) => {
            if (data.ack) {
                onPageNotifications("success", "Contact Details Updated")
            } else {
                if (data.result.code == "NO_DATA") {
                    onPageNotifications("error", "Contact Details Update Failed, No Data Passed.")
                }
                onPageNotifications("error", "Check Log For Details.")
                console.error(data.result)
            }
        }).catch(err => {
            console.error(err)
            onPageNotifications("error", `Error: ${err.code}, Message: ${err.message}`)
        })
    }
    return (
        <form id='site_contact_details' onSubmit={saveContactDetails}>
            <div className='card-body'>
                <div className='card-title'>Contact Details</div>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>House/Flat</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setAddressFlat(e.currentTarget.value)} value={addressFlat} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Address Block 1</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setAddressBlockOne(e.currentTarget.value)} value={addressBlockOne} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Address Block 2</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setAddressBlockTwo(e.currentTarget.value)} value={addressBlockTwo} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>State</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setAddressState(e.currentTarget.value)} value={addressState} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Country</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setAddressCountry(e.currentTarget.value)} value={addressCountry} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>PIN</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setAddressPIN(e.currentTarget.value)} value={addressPIN} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Phone/Mobile</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setPhone(e.currentTarget.value)} value={phone} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Whatsapp Support</span>
                    <input type="text" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setWhatsapp(e.currentTarget.value)} value={whatsapp} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Email</span>
                    <input type="email" className='join-item input input-bordered' name="cdn_domain" required onChange={e => setEmail(e.currentTarget.value)} value={email} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='site_contact_details'>Save</button>
                </div>
            </div>
        </form>
    )
}

export default SiteContactDetailsForm