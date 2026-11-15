import { createContext, useContext } from "react";

export const WishlistContext = createContext({
    items: [],
    count: 0,
    has: () => false,
    toggle: () => {},
});

export const useWishlist = () => useContext(WishlistContext);
