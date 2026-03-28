import { createDecipheriv, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const SALT = 'app-config-encryption-salt'

function getDerivedKey(): Buffer {
    const masterKey = process.env.CONFIG_ENCRYPTION_KEY
    if (!masterKey) {
        throw new Error('CONFIG_ENCRYPTION_KEY environment variable is not set.')
    }
    return scryptSync(masterKey, SALT, 32)
}

/**
 * Decrypt a value encrypted by the backend ConfigService (AES-256-GCM).
 * Expects the format: iv:authTag:ciphertext (all hex-encoded).
 */
export function decryptValue(encryptedStr: string): string {
    const key = getDerivedKey()
    const parts = encryptedStr.split(':')
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted value format')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const ciphertext = parts[2]

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
