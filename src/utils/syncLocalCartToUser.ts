const SYNC_LOCK_KEY = 'pending_cart_syncing'

type PendingCartItem = {
    productId?: string
    quantity?: number
    variation?: string
    variationCode?: string
    customSize?: unknown
}

type SyncResult = {
    attempted: number
    synced: number
    failed: number
}

/**
 * Syncs the guest cart from localStorage to the user's account cart on login.
 * Clears localStorage only after every pending item is accepted by the server.
 */
export default async function syncLocalCartToUser(userId: string): Promise<SyncResult> {
    if (typeof window === 'undefined') return { attempted: 0, synced: 0, failed: 0 }
    if (!userId) return { attempted: 0, synced: 0, failed: 0 }
    if (localStorage.getItem(SYNC_LOCK_KEY) === userId) return { attempted: 0, synced: 0, failed: 0 }

    const localCartRaw = localStorage.getItem('pending_cart')
    if (!localCartRaw) return { attempted: 0, synced: 0, failed: 0 }

    let localCart: PendingCartItem[] = []
    try {
        localCart = JSON.parse(localCartRaw)
    } catch {
        localStorage.removeItem('pending_cart')
        return { attempted: 0, synced: 0, failed: 0 }
    }

    if (!Array.isArray(localCart) || localCart.length === 0) return { attempted: 0, synced: 0, failed: 0 }

    localStorage.setItem(SYNC_LOCK_KEY, userId)
    const failedItems: PendingCartItem[] = []
    let synced = 0

    for (const item of localCart) {
        const productId = item.productId
        if (!productId) continue

        try {
            const res = await fetch('/api/user/addtocart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    quantity: Number(item.quantity ?? 1),
                    variationCode: item.variationCode ?? item.variation ?? '',
                    customSize: item.customSize ?? null,
                }),
            })

            if (res.ok) {
                synced += 1
            } else {
                failedItems.push(item)
                console.error(`Failed to add ${productId} to user cart:`, await res.text())
            }
        } catch (err) {
            failedItems.push(item)
            console.error(`Failed to add ${productId} to user cart:`, err)
        }
    }

    if (failedItems.length > 0) {
        localStorage.setItem('pending_cart', JSON.stringify(failedItems))
    } else {
        localStorage.removeItem('pending_cart')
    }

    localStorage.removeItem(SYNC_LOCK_KEY)
    window.dispatchEvent(new Event('local-cart-updated'))

    return {
        attempted: localCart.length,
        synced,
        failed: failedItems.length,
    }
}
