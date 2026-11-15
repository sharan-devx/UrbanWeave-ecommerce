import React from "react";
import { Link } from "react-router-dom";
import { EmptyBlock, ProductCard, SectionHead } from "./Store/ui";
import { useWishlist } from "./Store/wishlist";

export default function Wishlist() {
    const { items, count } = useWishlist();

    return (
        <section className="sf-section">
            <div className="sf-container">
                <SectionHead title="Your wishlist" text={count ? `${count} saved item${count !== 1 ? "s" : ""}` : "Save pieces you love and find them here later."} />
                {count === 0 ? (
                    <EmptyBlock icon="bi-heart" title="Nothing saved yet" text="Tap the heart on any product to save it.">
                        <Link to="/category" className="sf-btn">Browse products</Link>
                    </EmptyBlock>
                ) : (
                    <div className="sf-grid">
                        {items.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </section>
    );
}
