import React, { useEffect, useState } from "react";
import { WishlistContext } from "./wishlist";

const STORAGE_KEY = "urbanweave-wishlist";

const readStored = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
};

export function WishlistProvider({ children }) {
    const [items, setItems] = useState(readStored);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* storage full or blocked: the wishlist just will not persist */
        }
    }, [items]);

    const has = (id) => items.some((p) => p.id === id);

    const toggle = (product) =>
        setItems((current) =>
            current.some((p) => p.id === product.id)
                ? current.filter((p) => p.id !== product.id)
                : [
                      ...current,
                      {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image,
                          category: product.category,
                          rating: product.rating,
                      },
                  ]
        );

    return (
        <WishlistContext.Provider value={{ items, count: items.length, has, toggle }}>
            {children}
        </WishlistContext.Provider>
    );
}
