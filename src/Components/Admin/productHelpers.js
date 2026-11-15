export const EMPTY_PRODUCT = {
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "Men",
    rating: "",
    description: "",
};

export const toPayload = (product) => ({
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice === "" ? "" : Number(product.originalPrice),
    rating: Number(product.rating),
});
