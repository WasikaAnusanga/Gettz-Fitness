export default function getCart(){

    let cart = localStirage.getItem("cart");

    if(cart == null){
        cart = [];

        localStorage.setItem("cart",JSON.stringify(cart));
        return [];
    }
    cart = JSON.parse(cart);
    return cart;
}

export function addToCart(productId){
    const cart = getCart();
    
}