// @ts-nocheck
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react"
import { BiChevronsDown } from "react-icons/bi"

const FilterAccordion = ({ children, title }: { children: React.ReactNode, title: string }) => {
    return (
        <Disclosure className="border-collapse mb-4" as="div">
            {({ open }) => (
                <>
                    <DisclosureButton className={`${open ? 'rounded-t-md' : 'rounded-md'} border flex w-full p-4 justify-between items-center text-left text-md font-normal text-black hover:bg-secondary`}>
                        <span>{title}</span>
                        <BiChevronsDown className={`
                                    ${open ? 'rotate-180 transform' : ''} h-5 w-5 text-primary transition-transform
                                    `} />
                    </DisclosureButton>
                    <Transition
                        show={open}
                        enter="transition duration-150 ease-out"
                        enterFrom="transform scale-y-0 opacity-0"
                        enterTo="transform scale-y-100 opacity-100"
                        leave="transition duration-150 ease-out"
                        leaveFrom="transform scale-y-100 opacity-100"
                        leaveTo="transform scale-y-0 opacity-0"
                    >
                        <DisclosurePanel className={`${open ? 'rounded-b-md' : ''} border p-5`} static>
                            {children}
                        </DisclosurePanel>
                    </Transition>
                </>
            )}
        </Disclosure>
    )
}

export default FilterAccordion