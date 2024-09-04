import { FC } from "react"

interface FormattedAddressProps {
    addressData: {
        flat_house: string | undefined
        address1: string | undefined
        address2: string | undefined
        state: string | undefined
        country: string | undefined
        PIN: string | undefined
    }
}

const FormattedAddress: FC<FormattedAddressProps> = ({ addressData }: FormattedAddressProps) => {
    return (
        <p className="text-center grow-0 text-xl">
            {addressData.flat_house ? addressData.flat_house : ''}, {addressData.address1 ? addressData.address1 : ''}<br />
            {addressData.address2 ? addressData.address2 : ''}, {addressData.state ? addressData.state : ''},
            {addressData.country ? addressData.country : ''} - {addressData.PIN ? addressData.PIN : ''}
        </p>
    )
}

export default FormattedAddress