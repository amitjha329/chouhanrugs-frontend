'use client'
import saveThemeForm from '@/lib/actions/saveThemeForm'
import ThemeDataModel from '@/lib/types/ThemeDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useState, FormEventHandler } from 'react'

const ThemeForm = ({ themeData }: { themeData: ThemeDataModel }) => {
    const [currentTheme, setcurrentTheme] = useState(themeData.theme)
    const [currentFestival, setcurrentFestival] = useState<string | null>(themeData.festive ?? "")
    const [availableOptions] = useState(themeData.options ?? [])

    const updateTheme: FormEventHandler = (e) => {
        e.preventDefault()
        saveThemeForm(currentTheme, currentFestival).then(res => {
            if (res.ack) {
                onPageNotifications("success", "Site Theme Updated").finally(() => { window.location.reload() })
            } else {
                onPageNotifications("error", "Theme Update Failed, Check Log For Details.")
                console.error(res.result)
            }
        }).catch(err => {
            console.error(err)
            onPageNotifications("error", `Error: ${err.code}, Message: ${err.message}`)
        })
    }

    return (
        <form onSubmit={updateTheme}>
            <div className='card-body'>
                <div className='card-title'>Theme Settings</div>
                <label className='join join-vertical'>
                    <span className='join-item p-3 bg-gray-200'>Theme Name</span>
                    <select className='join-item select select-bordered' name="cdn_theme" required onChange={e => setcurrentTheme(e.currentTarget.value)} defaultValue={currentTheme}>
                        {availableOptions.map(item => <option key={item}>{item}</option>)}
                    </select>
                </label>

                <label className='join join-vertical'>
                    <span className='join-item p-3 bg-gray-200'>Festival Name</span>
                    <select className='join-item select select-bordered' name="cdn_festival" required onChange={e => {
                        e.currentTarget.value == "None" ? setcurrentFestival(null) : setcurrentFestival(e.currentTarget.value)
                    }} defaultValue={currentFestival ?? ""}>
                        <option>None</option>
                        <option>christmas</option>
                        <option>newyear</option>
                    </select>
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn'>Save</button>
                </div>
            </div>
        </form>
    )
}

export default ThemeForm