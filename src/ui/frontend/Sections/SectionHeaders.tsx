import clsx from "clsx"
import Link from "next/link"
import { BsArrowRight } from "react-icons/bs"

type propTypes = {
    sectionTitle: string,
    sectionButtonLink?: string
    buttonText?: string
    buttonVisible?: boolean
    className?: string
}

const SectionHeader = ({ sectionTitle, sectionButtonLink, buttonText, buttonVisible, className }: propTypes) => {
    return (
        <div className={clsx('flex items-center justify-between p-3 md:pb-8', className)}>
            <h2 className="text-xl md:text-3xl p-3">{sectionTitle}</h2>
            {
                buttonVisible && (<Link href={sectionButtonLink || "#"}>
                    <div className="flex flex-row items-center justify-betweentext-secondary hover:text-success hover:bg-gray-50 underline underline-offset-8 p-3 cursor-pointer">
                        <span>{buttonText}</span>
                        <BsArrowRight className="ml-3" />
                    </div>
                </Link>)
            }
        </div>
    )
}

export default SectionHeader