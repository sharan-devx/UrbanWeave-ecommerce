// Prices are stored as strings in db.json, so always convert before using them.
export const toNumber = (value) => Number(value) || 0;

export const formatPrice = (value) =>
    `₹ ${toNumber(value).toLocaleString("en-IN")}`;
