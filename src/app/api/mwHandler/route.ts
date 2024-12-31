import { getTokenDB, getUserMiddleWare } from '@/backend/serverActions/middleWareHandlers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { action, credentials } = await req.json()
    console.log(action, credentials)
    try {
        if (action === 'getTokenDB') {
            const token = await getTokenDB(credentials)
            return NextResponse.json(token)
        } else if (action === 'getUserMiddleWare') {
            const user = await getUserMiddleWare(credentials)
            return NextResponse.json(user)
        } else {
            return NextResponse.error()
        }
    } catch (error) {
        return NextResponse.error()
    }
}
