/**
 * Application configuration document stored in the `app_config` MongoDB collection.
 * Each document stores a single configurable value that was previously in .env files.
 *
 * Tiers:
 * - "secret"      – Encrypted at rest, never exposed to the frontend/browser
 * - "server"      – Plaintext in DB, never exposed to the frontend/browser
 * - "public"      – Plaintext, safe to serve to the browser
 */
type AppConfigDataModel = {
    _id: string
    /** Unique key identifier, e.g. "GOOGLE_CLIENT_SECRET" */
    key: string
    /** The stored value (encrypted for secret tier, plaintext otherwise) */
    value: string
    /** Security tier */
    tier: "secret" | "server" | "public"
    /** Logical grouping for admin panel display */
    group: string
    /** Human-readable label for the admin panel */
    label: string
    /** Description of what this config value does */
    description: string
    /** Whether this config key is required for the app to function */
    required: boolean
    /** ISO timestamp of last update */
    updatedAt: string
    /** User ID or email of who last updated */
    updatedBy: string
}

export default AppConfigDataModel
