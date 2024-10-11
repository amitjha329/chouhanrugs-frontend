import { userAgentFromString } from "next/server";

export default function getDevice({ headers }: { headers: Headers }) {
    const parsedHeader = userAgentFromString(headers.get('user-agent') ?? "")
    return parsedHeader.device.type
}