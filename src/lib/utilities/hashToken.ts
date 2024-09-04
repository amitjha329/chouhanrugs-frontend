import { createHash } from "crypto"

export function hashToken(token: string) {
    return (
        createHash("sha256")
            // Prefer provider specific secret, but use default secret if none specified
            .update(`${token}${process.env.NEXTAUTH_SECRET}`)
            .digest("hex")
    )
}