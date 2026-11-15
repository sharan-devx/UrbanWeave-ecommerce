import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { CartContext } from "./Context/CartContext";
import { LoginContext } from "./Context/LoginContext";
import { formatPrice, toNumber } from "../utils";
import { useStoreToast } from "./Store/storeToast";
import { EmptyBlock } from "./Store/ui";

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const { login } = useContext(LoginContext);
    const toast = useStoreToast();
    const user = login.user;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
    });
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    if (cart.length === 0) {
        return (
            <section className="sf-section">
                <div className="sf-container">
                    <EmptyBlock icon="bi-bag" title="Your cart is empty" text="Add something before checking out.">
                        <Link to="/category" className="sf-btn">Continue shopping</Link>
                    </EmptyBlock>
                </div>
            </section>
        );
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        setError("");
        setPlacing(true);
        try {
            await api.post("/orders", {
                userId: user.id,
                customerName: form.name,
                customerEmail: user.email,
                phone: form.phone,
                address: form.address,
                items: cart.map(({ id, name, price, image, quantity }) => ({
                    id, name, image, quantity, price: toNumber(price),
                })),
                total: cartTotal,
                payment: "Cash on Delivery",
                status: "Placed",
                createdAt: new Date().toISOString(),
            });
            clearCart();
            toast("Order placed. Thank you!");
            navigate("/orders");
        } catch (err) {
            console.error(err);
            setError("Could not place your order. Is the API running?");
            setPlacing(false);
        }
    };

    return (
        <section className="sf-section">
            <div className="sf-container">
                <ol className="sf-steps" aria-label="Checkout progress">
                    <li className="done"><span><i className="bi bi-check-lg"></i></span>Cart</li>
                    <li className="now"><span>2</span>Delivery</li>
                    <li><span>3</span>Confirmation</li>
                </ol>

                <div className="sf-split">
                    <form onSubmit={placeOrder} className="sf-panel">
                        <h2>Delivery details</h2>

                        <label className="sf-field">
                            <span>Full name</span>
                            <input name="name" value={form.name} onChange={change} className="sf-input" autoComplete="name" required />
                        </label>
                        <div className="sf-two">
                            <label className="sf-field">
                                <span>Phone</span>
                                <input name="phone" value={form.phone} onChange={change} className="sf-input" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+\s\-]{10,15}" title="Enter a valid phone number (10 to 15 digits)" required />
                            </label>
                            <label className="sf-field">
                                <span>Email</span>
                                <input value={user.email || ""} className="sf-input" readOnly />
                            </label>
                        </div>
                        <label className="sf-field">
                            <span>Delivery address</span>
                            <textarea name="address" value={form.address} onChange={change} rows="3" className="sf-input" autoComplete="street-address" required></textarea>
                        </label>

                        <div className="sf-label">Payment method</div>
                        <div className="sf-paycard">
                            <i className="bi bi-cash-coin"></i>
                            <div><strong>Cash on delivery</strong><span>Pay when your order arrives</span></div>
                            <i className="bi bi-check-circle-fill sf-good"></i>
                        </div>

                        {error && <div className="sf-alert danger" role="alert">{error}</div>}
                        <button type="submit" className="sf-btn w-100 mt-3" disabled={placing}>
                            {placing ? "Placing order..." : `Place order (${formatPrice(cartTotal)})`}
                        </button>
                    </form>

                    <aside className="sf-summary">
                        <h3>Order summary</h3>
                        {cart.map((item) => (
                            <div className="sf-mini" key={item.id}>
                                <img src={item.image} alt={item.name} />
                                <div className="flex-grow-1">
                                    <div className="sf-mini-name">{item.name}</div>
                                    <div className="sf-muted small">Qty {item.quantity}</div>
                                </div>
                                <span>{formatPrice(toNumber(item.price) * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="sf-row"><span>Delivery</span><span className="sf-good">Free</span></div>
                        <div className="sf-row total"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
                        <Link to="/cart" className="sf-link small">Edit cart</Link>
                    </aside>
                </div>
            </div>
        </section>
    );
}
