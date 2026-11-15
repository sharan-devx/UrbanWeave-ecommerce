import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { formatPrice, toNumber } from "../../utils";
import { useWishlist } from "./wishlist";
import { useStoreToast } from "./storeToast";
import { discountOf } from "./helpers";

export const Stars = ({ value, className = "" }) => {
    const rounded = Math.round(Number(value) || 0);
    return (
        <span className={`sf-stars ${className}`} role="img" aria-label={`${rounded} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <i key={n} className={`bi ${n <= rounded ? "bi-star-fill" : "bi-star"}`}></i>
            ))}
        </span>
    );
};

export const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { has, toggle } = useWishlist();
    const toast = useStoreToast();
    const liked = has(product.id);
    const off = discountOf(product);

    const add = () => {
        addToCart(product);
        toast(`${product.name} added to cart`);
    };

    const like = () => {
        toggle(product);
        toast(liked ? "Removed from wishlist" : "Saved to wishlist");
    };

    return (
        <article className="sf-card">
            <div className="sf-card-media">
                <Link to={`/productdetails/${product.id}`} aria-label={`View ${product.name}`}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                </Link>
                {off > 0 && <span className="sf-tag">{off}% off</span>}
                <button
                    type="button"
                    className={`sf-heart${liked ? " on" : ""}`}
                    onClick={like}
                    aria-pressed={liked}
                    aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
                </button>
                <button type="button" className="sf-btn sf-btn-dark sf-quick" onClick={add}>
                    <i className="bi bi-bag-plus me-2"></i>Add to cart
                </button>
            </div>
            <div className="sf-card-body">
                <div className="sf-card-cat">{product.category}</div>
                <Link className="sf-card-title" to={`/productdetails/${product.id}`}>{product.name}</Link>
                <div className="sf-card-foot">
                    <div>
                        <strong>{formatPrice(product.price)}</strong>
                        {toNumber(product.originalPrice) > toNumber(product.price) && (
                            <del className="sf-muted ms-2 small">{formatPrice(product.originalPrice)}</del>
                        )}
                    </div>
                    <Stars value={product.rating} />
                </div>
            </div>
        </article>
    );
};

export const ProductSkeleton = ({ count = 8 }) => (
    <div className="sf-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
            <div className="sf-card" key={i}>
                <div className="sf-skel" style={{ aspectRatio: "4 / 5" }}></div>
                <div className="sf-card-body">
                    <span className="sf-skel mb-2" style={{ width: "30%", height: ".7rem" }}></span>
                    <span className="sf-skel mb-2" style={{ width: "80%" }}></span>
                    <span className="sf-skel" style={{ width: "50%" }}></span>
                </div>
            </div>
        ))}
    </div>
);

export const EmptyBlock = ({ icon = "bi-bag", title, text, children }) => (
    <div className="sf-empty">
        <i className={`bi ${icon}`}></i>
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {children}
    </div>
);

export const PageHero = ({ title, text, image, gradient }) => (
    <section
        className="sf-pagehero"
        style={
            image
                ? { backgroundImage: `linear-gradient(rgba(8,26,20,.62), rgba(8,26,20,.62)), url(${image})` }
                : { backgroundImage: gradient }
        }
    >
        <div className="sf-container">
            <h1>{title}</h1>
            <p>{text}</p>
        </div>
    </section>
);

export const SectionHead = ({ title, text, children }) => (
    <div className="sf-sechead">
        <div>
            <h2>{title}</h2>
            {text && <p>{text}</p>}
        </div>
        {children}
    </div>
);
