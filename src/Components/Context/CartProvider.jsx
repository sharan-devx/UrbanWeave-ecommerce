import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { toNumber } from "../../utils";

const STORAGE_KEY = "urbanweave-cart";

const readStoredCart = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
};

export function CartProvider({ children }) {
    const [cart, setCart] = useState(readStoredCart);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((current) =>
            current.some((item) => item.id === product.id)
                ? current.map((item) =>
                      item.id === product.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                  )
                : [...current, { ...product, quantity: 1 }]
        );
    };

    const removeFromCart = (id) =>
        setCart((current) => current.filter((item) => item.id !== id));

    const increaseQuantity = (id) =>
        setCart((current) =>
            current.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );

    const decreaseQuantity = (id) =>
        setCart((current) =>
            current.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    
    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce(
        (sum, item) => sum + toNumber(item.price) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                cartTotal,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
