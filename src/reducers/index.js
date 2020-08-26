
const initialState = {
    books: [

    ],
    loading: true,
    error: null,
    cartItems: [

    ],
    orderTotal: 0
}

const updateCartItems = (cartItems, item, idx) => {
    if (item.count === 0){
        return [
            ...cartItems.slice(0, idx),

            ...cartItems.slice(idx + 1)
        ]
    }
    if (idx === -1){
        return[
            ...cartItems,
            item
        ]
    }
    return [
        ...cartItems.slice(0, idx),
        item,
        ...cartItems.slice(idx + 1)
    ]
}

const updateCartItem = (book, item={}, quantity) => {

    const {id=book.id, count=0, title=book.title, total=0} = item

   return{
        id,
       title,
       count: count + quantity,
       total: total + quantity * book.price
   }

}

const upDateOrder = (state, bookId, quantity) => {
    const {books, cartItems} = state
    const book = books.find(({id}) => id === bookId )
    const itemIndex = cartItems.findIndex(({id}) => id === bookId)
    const item = cartItems[itemIndex]

    const newItem = updateCartItem(book, item, quantity)

    return {
        ...state,
        cartItems: updateCartItems(cartItems, newItem, itemIndex)

    }
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case 'BOOKS_LOADED':
            return {
                ...state,
                books: action.payload,
                loading: false,
                error: null
            }
        case 'BOOKS_REQUESTED':
            return {
                ...state, loading: false
            }
        case 'BOOKS_ERROR':
            return {
                ...state,
                books: [],
                loading: false,
                error: action.payload
            }
        case 'BOOK_ADDED_TO_CARD':
           return  upDateOrder(state, action.payload, 1)

        case 'BOOK_REMOVED_FROM_CARD':
            return upDateOrder(state, action.payload, -1)

        case 'ALL_BOOKS_REMOVED_FROM_CARD':
            const item = state.cartItems.find(({id})=> id === action.payload)
            return upDateOrder(state, action.payload, -item.count)


        default:
            return state
    }

}
export default reducer