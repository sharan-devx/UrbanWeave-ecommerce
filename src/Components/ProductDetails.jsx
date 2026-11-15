import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { CartContext } from "./Context/CartContext";
import { formatPrice, toNumber } from "../utils";
import { useWishlist } from "./Store/wishlist";
import { useStoreToast } from "./Store/storeToast";
import { discountOf, formatDate } from "./Store/helpers";
import { EmptyBlock, ProductCard, SectionHead, Stars } from "./Store/ui";

const SIZES = ["S", "M", "L", "XL"];

const PERKS = [
    { icon: "bi-truck", title: "Free delivery", text: "Free shipping on all orders above ₹999." },
    { icon: "bi-arrow-repeat", title: "Easy returns", text: "7-day hassle-free return policy." },
    { icon: "bi-shield-check", title: "Secure payment", text: "100% secure and trusted payment methods." },
];

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { has, toggle } = useWishlist();
    const toast = useStoreToast();
    const navigate = useNavigate();
    const [result, setResult] = useState({ id: null, product: null, reviews: [], related: [] });
    const [size, setSize] = useState("M");

    useEffect(() => {
        let cancelled = false;
        api.get(`/products/${id}`)
            .then(async (res) => {
                const product = res.data;
                // Reviews and related products are extras: never block the page if they fail.
                const [reviews, related] = await Promise.all([
                    api.get("/reviews", { params: { productId: id } }).catch(() => ({ data: [] })),
                    api.get("/products", { params: { category: product.category } }).catch(() => ({ data: [] })),
                ]);
                if (cancelled) return;
                setResult({
                    id,
                    product,
                    reviews: reviews.data,
                    related: related.data.filter((p) => p.id !== product.id).slice(0, 4),
                });
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setResult({ id, product: null, reviews: [], related: [] });
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const { product, reviews, related } = result;

    if (result.id !== id) {
        return (
            <div className="sf-container sf-section">
                <div className="sf-pd">
                    <div className="sf-skel" style={{ aspectRatio: "4 / 5", borderRadius: 20 }}></div>
                    <div>
                        <span className="sf-skel mb-3" style={{ width: "25%" }}></span>
                        <span className="sf-skel mb-3" style={{ width: "70%", height: "2rem" }}></span>
                        <span className="sf-skel mb-2" style={{ width: "40%" }}></span>
                        <span className="sf-skel mb-2"></span>
                        <span className="sf-skel" style={{ width: "85%" }}></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="sf-container sf-section">
                <EmptyBlock icon="bi-emoji-frown" title="Product not found" text="It may have been removed.">
                    <Link to="/category" className="sf-btn">Browse products</Link>
                </EmptyBlock>
            </div>
        );
    }

    const liked = has(product.id);
    const off = discountOf(product);
    const rated = reviews.map((r) => Number(r.rating)).filter(Boolean);
    const average = rated.length ? rated.reduce((s, n) => s + n, 0) / rated.length : Number(product.rating) || 0;
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleAdd = () => {
        addToCart(product);
        toast(`${product.name} added to cart`);
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate("/checkout");
    };

    const handleLike = () => {
        toggle(product);
        toast(liked ? "Removed from wishlist" : "Saved to wishlist");
    };

    return (
        <section className="sf-section">
            <div className="sf-container">
                <nav className="sf-crumbs" aria-label="Breadcrumb">
                    <Link to="/">Home</Link><i className="bi bi-chevron-right"></i>
                    <Link to={`/${(product.category || "").toLowerCase()}`}>{product.category}</Link><i className="bi bi-chevron-right"></i>
                    <span>{product.name}</span>
                </nav>

                <div className="sf-pd">
                    <div className="sf-pd-media">
                        <img src={product.image} alt={product.name} />
                        {off > 0 && <span className="sf-tag">{off}% off</span>}
                    </div>

                    <div className="sf-pd-info">
                        <span className="sf-pill">{product.category}</span>
                        <h1>{product.name}</h1>

                        <div className="sf-pd-rating">
                            <Stars value={average} />
                            <span>{average.toFixed(1)}</span>
                            <a href="#reviews" className="sf-link">{reviews.length} review{reviews.length !== 1 && "s"}</a>
                        </div>

                        <div className="sf-pd-price">
                            <strong>{formatPrice(product.price)}</strong>
                            {toNumber(product.originalPrice) > toNumber(product.price) && <del>{formatPrice(product.originalPrice)}</del>}
                            {off > 0 && <span className="sf-save">You save {formatPrice(toNumber(product.originalPrice) - toNumber(product.price))}</span>}
                        </div>

                        <p className="sf-pd-desc">{product.description}</p>

                        <div className="sf-label">Select size</div>
                        <div className="sf-sizes" role="radiogroup" aria-label="Size">
                            {SIZES.map((s) => (
                                <button key={s} type="button" role="radio" aria-checked={size === s} className={size === s ? "on" : ""} onClick={() => setSize(s)}>{s}</button>
                            ))}
                        </div>

                        <div className="sf-pd-actions">
                            <button type="button" className="sf-btn" onClick={handleAdd}><i className="bi bi-bag-plus me-2"></i>Add to cart</button>
                            <button type="button" className="sf-btn sf-btn-accent" onClick={handleBuyNow}>Buy now</button>
                            <button type="button" className={`sf-btn sf-btn-ghost sf-btn-icon${liked ? " liked" : ""}`} onClick={handleLike} aria-pressed={liked} aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}>
                                <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
                            </button>
                        </div>

                        <ul className="sf-perklist">
                            {PERKS.map((p) => (
                                <li key={p.title}>
                                    <i className={`bi ${p.icon}`}></i>
                                    <div><strong>{p.title}</strong><span>{p.text}</span></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div id="reviews" className="sf-reviews">
                    <SectionHead title="Customer reviews" text={reviews.length ? `${average.toFixed(1)} out of 5, from ${reviews.length} review${reviews.length !== 1 ? "s" : ""}` : "No reviews yet"} />
                    {sortedReviews.length === 0 ? (
                        <p className="sf-muted">Buy this item and review it from My Orders once it is delivered.</p>
                    ) : (
                        <div className="sf-review-list">
                            {sortedReviews.map((r) => (
                                <div className="sf-review" key={r.id}>
                                    <span className="sf-avatar">{(r.userName || "?").charAt(0).toUpperCase()}</span>
                                    <div>
                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                            <strong>{r.userName || "Customer"}</strong>
                                            <Stars value={r.rating} />
                                            <span className="sf-muted small">{formatDate(r.createdAt)}</span>
                                        </div>
                                        {r.comment && <p>{r.comment}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {related.length > 0 && (
                    <div className="mt-5">
                        <SectionHead title="You may also like" text={`More from ${product.category}`} />
                        <div className="sf-grid">
                            {related.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductDetails;
