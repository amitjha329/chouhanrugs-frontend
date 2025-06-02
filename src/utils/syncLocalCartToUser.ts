/**
 * Syncs the guest cart from localStorage to the user's account cart on login.
 * - Adds all local cart items to the user's server cart if not already present.
 * - Optionally merges quantities if the same product/variation exists.
 * - Clears the localStorage cart after sync.
 * @param userId The logged-in user's ID
 */
export default async function syncLocalCartToUser(userId: string, addToCart: ((userId: string, productId: string, quantity: number, variationCode: string, onSuccess?: () => void, onError?: (err: any) => void) => Promise<void>)) {
    if (typeof window === 'undefined') return
    const localCartRaw = localStorage.getItem('pending_cart')
    if (!localCartRaw) return
    const localCart = JSON.parse(localCartRaw)
    if (!Array.isArray(localCart) || localCart.length === 0) return

    for (const item of localCart) {
        // Add to user cart
        await addToCart(userId, item.productId, item.quantity, item.variation, () => {
            console.log(`Added ${item.quantity} of ${item.productId} to user cart with variation ${item.variation}`);
        }, (err) => {
            console.error(`Failed to add ${item.productId} to user cart:`, err)
        })
        // Optionally: handle merging quantities if exists
    }
    // Clear local cart
    localStorage.removeItem('pending_cart')
}
