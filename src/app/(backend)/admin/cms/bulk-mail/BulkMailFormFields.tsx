"use client"
import { MailFormType } from '@/lib/actions/sendMail'
import React, { useRef, useState } from 'react'
import { Button, FileTrigger, Input, Label, TextArea, TextField } from 'react-aria-components'
import { useFormStatus } from 'react-dom'

const BulkMailFormFields = ({ state }: { state: MailFormType }) => {
    const { pending } = useFormStatus()
    const [emails, setEmails] = useState<string[]>([])

    return (
        <>
            <TextField name='to' type='email' value={emails.join('; ')} isReadOnly={true}>
                <Label className='block font-medium leading-6 text-gray-900'>Clients</Label>
                <Input className="block w-full input input-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 plac eholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onKeyDown={e => {
                    if (e.key == "Backspace") {
                        setEmails(emails.slice(0, -1))
                    }
                }} />
            </TextField>
            <TextField type="email">
                <Label className='block font-medium leading-6 text-gray-900'>Enter Email/ Or Paste</Label>
                <Input className="block w-full input input-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 plac eholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onKeyDown={e => {
                    switch (e.key) {
                        case ',':
                            e.preventDefault()
                            setEmails([...emails, e.currentTarget.value.toString()])
                            e.currentTarget.value = ""
                            break;
                        case 'Enter':
                            e.preventDefault()
                            setEmails([...emails, e.currentTarget.value.toString()])
                            e.currentTarget.value = ""
                            break;
                    }
                }} onPaste={e => {
                    e.preventDefault()
                    setEmails([...emails, ...e.clipboardData.getData('text/plain').split(',')])
                }} />
                <Label className='block font-medium leading-6 text-sm text-gray-500'>Please do keep in mind that all the emails are a list with comma seperates emails. examples: demo@demo.com, demo@demo.com, demo@demo.com</Label>
            </TextField>
            <TextField name='subject'>
                <Label className='block font-medium leading-6 text-gray-900'>Mail Subject</Label>
                <Input className="block w-full input input-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 plac eholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </TextField>
            {/* <Input type='file' value={file} /> */}
            <Label className="block font-medium leading-6 text-gray-900">Template File
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/50 px-6 py-10 w-full">
                    <div className="text-center">
                        <div className="mt-4 flex leading-6 text-gray-600">
                            <div className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                <span>Upload a file</span>
                            </div>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">HTML up to 10MB</p>
                    </div>
                </div>
                <Input id="msg" name="msg" type="file" className="sr-only hidden" />
            </Label>
            <Button className='btn btn-sm mt-10' type='submit' isDisabled={pending}>Send</Button>
        </>
    )
}

export default BulkMailFormFields