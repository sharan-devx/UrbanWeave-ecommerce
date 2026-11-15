import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./Context/CartContext";
import { formatPrice, toNumber } from "../utils";
import { useStoreToast } from "./Store/storeToast";
import { EmptyBlock, SectionHead } from "./Store/ui";

export default function Cart() {
    const { cart, cartCount, cartTotal, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const toast = useStoreToast();

    const remove = (item) => {
        removeFromCart(item.id);
        toast(`${item.name} removed`);
    };

    return (
        <section className="sf-section">
            <div className="sf-container">
                <SectionHead title="Your cart" text={cart.length ? `${cartCount} item${cartCount !== 1 ? "s" : ""}` : undefined} />

                {cart.length === 0 ? (
                    <EmptyBlock icon="bi-bag" title="Your cart is empty" text="Looks like you have not added anything yet.">
                        <Link to="/category" className="sf-btn">Start shopping</Link>
                    </EmptyBlock>
                ) : (
                    <div className="sf-split">
                        <div>
                            {cart.map((item) => (
                                <div className="sf-line" key={item.id}>
                                    <Link to={`/productdetails/${item.id}`}><img src={item.image} alt={item.name} /></Link>
                                    <div className="sf-line-info">
                                        <Link to={`/productdetails/${item.id}`} className="sf-line-name">{item.name}</Link>
                                        <div className="sf-muted">{formatPrice(item.price)} each</div>
                                        <div className="sf-stepper">
                                            <button type="button" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1} aria-label="Decrease quantity"><i className="bi bi-dash"></i></button>
                                            <span>{item.quantity}</span>
                                            <button type="button" onClick={() => increaseQuantity(item.id)} aria-label="Increase quantity"><i className="bi bi-plus"></i></button>
                                        </div>
                                    </div>
                                    <div className="sf-line-end">
                                        <strong>{formatPrice(toNumber(item.price) * item.quantity)}</strong>
                                        <button type="button" className="sf-iconbtn danger" onClick={() => remove(item)} aria-label={`Remove ${item.name}`}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <Link to="/category" className="sf-link"><i className="bi bi-arrow-left me-1"></i>Continue shopping</Link>
                        </div>

                        <aside className="sf-summary">
                            <h3>Order summary</h3>
                            <div className="sf-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                            <div className="sf-row"><span>Delivery</span><span className="sf-good">Free</span></div>
                            <div className="sf-row total"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
                            <Link to="/checkout" className="sf-btn w-100 mt-3">Proceed to checkout</Link>
                            <p className="sf-muted small mt-3 mb-0"><i className="bi bi-shield-check me-1"></i>Cash on delivery available</p>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}
