import { toNumber } from "../../utils";

// Percentage saved when originalPrice is higher than price, otherwise 0.
export const discountOf = (product) => {
    const price = toNumber(product.price);
    const original = toNumber(product.originalPrice);
    return original > price && price > 0 ? Math.round((1 - price / original) * 100) : 0;
};

export const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
