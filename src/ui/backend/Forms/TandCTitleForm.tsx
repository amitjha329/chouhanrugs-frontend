'use client'

import { saveTermsTitle } from "@/lib/actions/saveTermsData";
import onPageNotifications from "@/ui/common/onPageNotifications";
import { useState } from "react";

const TandCTitleForm = ({ title }: { title: string }) => {
    const [titleNew, setTitle] = useState(title)
    return (
        <div className='form-control gap-4'>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Title</span>
                <input type="text" className='input input-bordered w-full' placeholder='Page Title' required onChange={e => setTitle(e.currentTarget.value)} defaultValue={titleNew} />
            </label>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' type='submit' onClick={e => {
                    saveTermsTitle(titleNew).then((result) => {
                        if (result.ack) {
                            onPageNotifications("success", "Data Updated").then(() => {
                                window.location.reload()
                            }).catch(e => console.log(e))
                        } else {
                            onPageNotifications("error", "Unable to Update Data").catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))
                }}>Save</button>
            </div>
        </div>
    );
}

export default TandCTitleForm;