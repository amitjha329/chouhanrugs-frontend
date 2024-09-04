'use client'
import { FormEvent } from "react"

const FooterTop = () => {
    const subscribeHandler = (e: FormEvent) => {
        e.preventDefault()
    }
    return (
        <div className="container mx-auto absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-xl max-h-28 flex justify-center items-center min-h-[200px] md:min-h-[250px]">
            <form id="subscribe_form" className="flex flex-col md:min-w-[600px] px-8 md:px-0" onSubmit={subscribeHandler}>
                <span className="text-lg lg:text-2xl text-white text-center mb-5">Get Access to Updates in you Mailbox.</span>
                <input type="email" className="input lg:input-lg placeholder-primary placeholder-opacity-50 text-center rounded-b-none" placeholder="Enter you email address" />
                <button className="btn bg-black border-black hover:btn-outline rounded-t-none" type="submit">Subscribe</button>
            </form>
        </div>
    )
}
export default FooterTop