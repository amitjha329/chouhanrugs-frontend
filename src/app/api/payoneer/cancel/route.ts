import { NextRequest, NextResponse } from 'next/server'
import { cancelPayoneerOrder, updatePayoneerOrderStatus } from '@/backend/serverActions/payoneer'

/**
 * API endpoint to cancel a Payoneer order
 * Used when user cancels payment or payment fails
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orderId, reason, status } = body

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        console.log(`📋 Cancel order request: ${orderId}, reason: ${reason}, status: ${status}`)

        let result

        // If status is provided, use updatePayoneerOrderStatus for more detailed tracking
        if (status === 'cancelled' || status === 'failed') {
            result = await updatePayoneerOrderStatus(
                orderId,
                'user-cancelled',
                status
            )
        } else {
            // Use the cancel function
            result = await cancelPayoneerOrder(orderId, reason || 'Payment cancelled by user')
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Order ${orderId} has been cancelled`
            })
        } else {
            return NextResponse.json(
                { error: result.error || 'Failed to cancel order' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Error cancelling order:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
