import CartDataModel from '@/types/CartDataModel'
import CartLineItem from './CartLineItem'

const CartItem = ({ item }: { item: CartDataModel }) => <CartLineItem item={item} />

export default CartItem
