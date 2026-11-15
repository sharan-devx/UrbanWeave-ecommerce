import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { LoginContext } from "./Context/LoginContext";
import { CartContext } from "./Context/CartContext";
import { formatPrice } from "../utils";
import { useStoreToast } from "./Store/storeToast";
import { EmptyBlock, SectionHead, Stars } from "./Store/ui";

// Customers can review items only after the order is delivered.
const canReview = (order) => order.status === "Delivered";

const FLOW = ["Placed", "Processing", "Shipped", "Delivered"];

const Tracker = ({ status }) => {
    if (status === "Cancelled") {
        return <div className="sf-alert danger mb-0"><i className="bi bi-x-circle me-2"></i>This order was cancelled.</div>;
    }
    const at = Math.max(FLOW.indexOf(status), 0);
    return (
        <ol className="sf-track" aria-label={`Order status: ${status}`}>
            {FLOW.map((step, i) => (
                <li key={step} className={i <= at ? "done" : ""}>
                    <span><i className={`bi ${i <= at ? "bi-check-lg" : "bi-circle"}`}></i></span>
                    {step}
                </li>
            ))}
        </ol>
    );
};

const StarPicker = ({ value, onChange }) => (
    <div role="group" aria-label="Rating" className="sf-starpick">
        {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={value === n}>
                <i className={`bi ${n <= value ? "bi-star-fill" : "bi-star"}`}></i>
            </button>
        ))}
    </div>
);

const ReviewForm = ({ item, orderId, userId, userName, onSaved, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        if (!rating) {
            setError("Please choose a star rating.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const res = await api.post("/reviews", {
                productId: item.id,
                orderId,
                userId,
                userName,
                rating,
                comment: comment.trim(),
                createdAt: new Date().toISOString(),
            });
            onSaved(res.data);
        } catch (err) {
            console.error(err);
            setError("Could not save your review. Please try again.");
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} className="sf-reviewform">
            <div className="fw-semibold mb-1">Rate {item.name}</div>
            <StarPicker value={rating} onChange={setRating} />
            <textarea
                className="sf-input mt-2"
                rows={3}
                maxLength={500}
                placeholder="Share your experience (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                aria-label="Review comment"
            />
            {error && <div className="sf-error">{error}</div>}
            <div className="d-flex gap-2 mt-3">
                <button type="submit" className="sf-btn sf-btn-sm" disabled={saving}>{saving ? "Saving..." : "Submit review"}</button>
                <button type="button" className="sf-btn sf-btn-ghost sf-btn-sm" onClick={onCancel} disabled={saving}>Cancel</button>
            </div>
        </form>
    );
};

export default function MyOrders() {
    const { login } = useContext(LoginContext);
    const { addToCart } = useContext(CartContext);
    const toast = useStoreToast();
    const userId = login.user.id;
    const userName = login.user.name;
    const [orders, setOrders] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [openForm, setOpenForm] = useState(null); // "orderId-productId" of the open form

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            api.get("/orders", { params: { userId } }),
            // If reviews fail to load, still show the orders.
            api.get("/reviews", { params: { userId } }).catch(() => ({ data: [] })),
        ])
            .then(([ordersRes, reviewsRes]) => {
                if (cancelled) return;
                setOrders([...ordersRes.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setReviews(reviewsRes.data);
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setOrders([]);
            });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (orders === null) {
        return (
            <section className="sf-section">
                <div className="sf-container">
                    {[0, 1].map((i) => (
                        <div className="sf-panel mb-3" key={i}>
                            <span className="sf-skel mb-3" style={{ width: "30%" }}></span>
                            <span className="sf-skel mb-2"></span>
                            <span className="sf-skel" style={{ width: "60%" }}></span>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // One review per product per customer.
    const reviewByProduct = Object.fromEntries(reviews.map((r) => [r.productId, r]));

    const handleSaved = (review) => {
        setReviews((prev) => [...prev, review]);
        setOpenForm(null);
        toast("Thanks for your review!");
    };

    const buyAgain = (order) => {
        order.items.forEach((item) => {
            for (let n = 0; n < item.quantity; n++) addToCart(item);
        });
        toast("Items added to your cart");
    };

    return (
        <section className="sf-section">
            <div className="sf-container">
                <SectionHead title="My orders" text={orders.length ? `${orders.length} order${orders.length !== 1 ? "s" : ""}` : undefined} />

                {orders.length === 0 ? (
                    <EmptyBlock icon="bi-box-seam" title="No orders yet" text="When you place an order it will show up here.">
                        <Link to="/category" className="sf-btn">Start shopping</Link>
                    </EmptyBlock>
                ) : (
                    orders.map((order) => (
                        <div className="sf-panel sf-order" key={order.id}>
                            <div className="sf-order-head">
                                <div>
                                    <strong>Order #{order.id}</strong>
                                    <div className="sf-muted small">{new Date(order.createdAt).toLocaleString("en-IN")}</div>
                                </div>
                                <span className={`sf-status sf-${(order.status || "").toLowerCase()}`}>{order.status}</span>
                            </div>

                            <Tracker status={order.status} />

                            <div className="sf-order-items">
                                {order.items.map((item) => {
                                    const formKey = `${order.id}-${item.id}`;
                                    const existing = reviewByProduct[item.id];
                                    return (
                                        <div key={item.id}>
                                            <div className="sf-mini">
                                                <Link to={`/productdetails/${item.id}`}><img src={item.image} alt={item.name} /></Link>
                                                <div className="flex-grow-1">
                                                    <div className="sf-mini-name">{item.name} × {item.quantity}</div>
                                                    {existing && (
                                                        <div className="small">
                                                            <Stars value={Number(existing.rating)} />
                                                            <span className="sf-muted ms-2">Your review</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span>{formatPrice(item.price * item.quantity)}</span>
                                                {!existing && canReview(order) && openForm !== formKey && (
                                                    <button type="button" className="sf-btn sf-btn-ghost sf-btn-sm" onClick={() => setOpenForm(formKey)}>
                                                        <i className="bi bi-star me-1"></i>Review
                                                    </button>
                                                )}
                                            </div>
                                            {openForm === formKey && (
                                                <ReviewForm
                                                    item={item}
                                                    orderId={order.id}
                                                    userId={userId}
                                                    userName={userName}
                                                    onSaved={handleSaved}
                                                    onCancel={() => setOpenForm(null)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {!canReview(order) && order.status !== "Cancelled" && (
                                <p className="sf-muted small mb-0">You can review these items once your order is delivered.</p>
                            )}

                            <div className="sf-order-foot">
                                <button type="button" className="sf-btn sf-btn-ghost sf-btn-sm" onClick={() => buyAgain(order)}>
                                    <i className="bi bi-arrow-repeat me-1"></i>Buy again
                                </button>
                                <div className="sf-order-total">Total <strong>{formatPrice(order.total)}</strong></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
