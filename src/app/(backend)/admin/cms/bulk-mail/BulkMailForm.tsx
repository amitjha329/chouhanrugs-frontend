"use client"
import React from 'react'
import { Form } from 'react-aria-components'
import BulkMailFormFields from './BulkMailFormFields'
import { useFormState } from 'react-dom'
import sendMail from '@/lib/actions/sendMail'

const BulkMailForm = () => {
    const [state, action] = useFormState(sendMail, {
        error: false,
        mailsSent: false
    })
    return (
        <Form action={action}>
            <BulkMailFormFields state={state} />
        </Form>
    )
}

export default BulkMailForm