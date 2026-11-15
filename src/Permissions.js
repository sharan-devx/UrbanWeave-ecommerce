export const STAFF_ROLES = ["admin", "employee"];

export const POSITIONS = {
    orders: "Order Manager",
    products: "Product Manager",
    support: "Support Agent",
};

const POSITION_ACCESS = {
    orders: ["vieworders"],
    products: ["addproduct", "viewproducts"],
    support: ["viewenquiries", "viewreviews"],
};

export const isStaff = (user) => STAFF_ROLES.includes(user?.role);

export const canAccess = (user, page) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "employee") {
        return (POSITION_ACCESS[user.position] || []).includes(page);
    }
    return false;
};