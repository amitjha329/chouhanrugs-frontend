'use client'
import { RefObject, useEffect, useState } from "react"

export default function useOnScreenObserver({ element, rootMargin, root }: { element: RefObject<Element>, rootMargin: string, root?: RefObject<Element> }) {

    const [isIntersecting, setIsIntersecting] = useState<boolean>(false)
    const [observer, setObserver] = useState<IntersectionObserver>()


    useEffect(() => {
        if (!observer) {
            setObserver(new IntersectionObserver(
                ([entry]) => setIsIntersecting(entry.isIntersecting)
                , { rootMargin, root: root?.current }))
        }
        if (element.current != null && observer) {
            observer.observe(element.current)
            return () => observer.disconnect()
        } else return
    }, [element, observer, rootMargin])

    return isIntersecting
}