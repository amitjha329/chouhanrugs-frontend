/**
 * Email Unsubscribe Utility
 * 
 * This utility provides helper functions for generating unsubscribe links
 * to be used in email templates.
 * 
 * USAGE IN EMAIL TEMPLATES:
 * 
 * 1. Import the function:
 *    import { createUnsubscribeLink } from '@/utils/emailUnsubscribe'
 * 
 * 2. Generate the link when sending emails:
 *    const unsubscribeUrl = createUnsubscribeLink(userEmail)
 * 
 * 3. Pass it to your email template:
 *    {
 *      ...emailData,
 *      unsubscribeUrl: unsubscribeUrl
 *    }
 * 
 * 4. In your Handlebars template:
 *    <a href="{{unsubscribeUrl}}">Unsubscribe</a>
 * 
 * 5. In your HTML email string:
 *    `<a href="${unsubscribeUrl}">Unsubscribe</a>`
 * 
 * EXAMPLE:
 * 
 * // In your email sending function
 * import { createUnsubscribeLink } from '@/utils/emailUnsubscribe'
 * 
 * async function sendNewsletterEmail(email: string, content: string) {
 *   const unsubscribeUrl = createUnsubscribeLink(email)
 *   
 *   await sendEmail({
 *     to: email,
 *     subject: 'Newsletter',
 *     html: `
 *       <div>${content}</div>
 *       <p>
 *         <a href="${unsubscribeUrl}">Unsubscribe from this mailing list</a>
 *       </p>
 *     `
 *   })
 * }
 */

import crypto from 'crypto'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chouhanrugs.com'

/**
 * Generate a secure token for the unsubscribe link
 * This ensures only valid links can unsubscribe users
 */
export function generateUnsubscribeToken(email: string): string {
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
    const normalizedEmail = email.toLowerCase().trim()
    const data = `${normalizedEmail}-${secret}`
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32)
}

/**
 * Create a full unsubscribe URL for a given email
 * Use this when generating email content
 * 
 * @param email - The subscriber's email address
 * @param baseUrl - Optional custom base URL (defaults to NEXT_PUBLIC_SITE_URL)
 * @returns Full unsubscribe URL with email and token parameters
 */
export function createUnsubscribeLink(email: string, baseUrl?: string): string {
    const token = generateUnsubscribeToken(email)
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim())
    const base = baseUrl || BASE_URL
    return `${base}/unsubscribe?email=${encodedEmail}&token=${token}`
}

/**
 * Verify an unsubscribe token is valid for the given email
 * Used by the unsubscribe page/action to validate requests
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
    const expectedToken = generateUnsubscribeToken(email)
    return token === expectedToken
}

export default createUnsubscribeLink
