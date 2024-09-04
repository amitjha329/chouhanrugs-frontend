import { ReadonlyURLSearchParams } from "next/navigation"

export default function createQueryString(previous: ReadonlyURLSearchParams | null, name: string, value: string) {
    const params = new URLSearchParams((previous ?? "").toString())
    params.set(name, value)
    return params.toString()
}