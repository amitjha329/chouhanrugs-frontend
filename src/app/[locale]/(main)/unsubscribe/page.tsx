import { Metadata } from 'next'
import UnsubscribeClient from './UnsubscribeClient'

export const metadata: Metadata = {
    title: 'Unsubscribe | Chouhan Rugs',
    description: 'Unsubscribe from Chouhan Rugs mailing list',
    robots: {
        index: false,
        follow: false
    }
}

type Props = {
    searchParams: Promise<{ email?: string; token?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
    const params = await searchParams
    const email = params.email || ''
    const token = params.token || ''

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <UnsubscribeClient email={email} token={token} />
        </div>
    )
}
