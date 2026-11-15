import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toNumber } from "../utils";
import { EmptyBlock, ProductCard, ProductSkeleton, SectionHead } from "./Store/ui";

const TABS = ["All", "Men", "Women", "Kids"];

const PRICES = [
    { key: "", label: "Any price", test: () => true },
    { key: "low", label: "Up to ₹1,000", test: (p) => p <= 1000 },
    { key: "medium", label: "₹1,000 to ₹2,000", test: (p) => p > 1000 && p <= 2000 },
    { key: "high", label: "Above ₹2,000", test: (p) => p > 2000 },
];


export default function Products({ category, heading, subheading, limit }) {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading");
    const [tab, setTab] = useState("All");
    const [sort, setSort] = useState("");
    const [priceKey, setPriceKey] = useState("");
    const [query, setQuery] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        api.get("/products", { params: category ? { category } : {} })
            .then((res) => {
                if (cancelled) return;
                setProducts(res.data);
                setStatus("done");
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [category, reloadKey]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const inRange = PRICES.find((p) => p.key === priceKey).test;
        const list = products.filter(
            (item) =>
                (category || tab === "All" || item.category === tab) &&
                inRange(toNumber(item.price)) &&
                (!q || item.name?.toLowerCase().includes(q))
        );
        if (sort === "low-high") list.sort((a, b) => toNumber(a.price) - toNumber(b.price));
        if (sort === "high-low") list.sort((a, b) => toNumber(b.price) - toNumber(a.price));
        return list;
    }, [products, category, tab, sort, priceKey, query]);

    const shown = limit ? visible.slice(0, limit) : visible;
    const filtersOn = tab !== "All" || sort || priceKey || query;

    const reset = () => {
        setTab("All");
        setSort("");
        setPriceKey("");
        setQuery("");
    };

    const retry = () => {
        setStatus("loading");
        setReloadKey((k) => k + 1);
    };

    return (
        <section className="sf-section">
            <div className="sf-container">
                {heading && <SectionHead title={heading} text={subheading} />}

                <div className="sf-filterbar">
                    <div className="sf-search">
                        <i className="bi bi-search"></i>
                        <input
                            type="search"
                            className="sf-input"
                            placeholder="Search products"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search products"
                        />
                    </div>
                    <select className="sf-input sf-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                        <option value="">Sort by: Featured</option>
                        <option value="low-high">Price: Low to High</option>
                        <option value="high-low">Price: High to Low</option>
                    </select>
                    {!category && (
                        <div className="sf-chips">
                            {TABS.map((name) => (
                                <button key={name} type="button" className={`sf-chip${tab === name ? " active" : ""}`} onClick={() => setTab(name)}>
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="sf-chips">
                        {PRICES.map((p) => (
                            <button key={p.key} type="button" className={`sf-chip${priceKey === p.key ? " active" : ""}`} onClick={() => setPriceKey(p.key)}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {status === "loading" && <ProductSkeleton count={limit || 8} />}

                {status === "error" && (
                    <EmptyBlock icon="bi-wifi-off" title="Could not load products" text="Check that your API server is running, then try again.">
                        <button type="button" className="sf-btn" onClick={retry}>Try again</button>
                    </EmptyBlock>
                )}

                {status === "done" && (
                    <>
                        <div className="sf-meta">
                            <span>{visible.length} product{visible.length !== 1 && "s"}</span>
                            {filtersOn && <button type="button" className="sf-link" onClick={reset}>Clear filters</button>}
                        </div>
                        {visible.length === 0 ? (
                            <EmptyBlock icon="bi-search" title={`No ${category ? `${category}'s ` : ""}products found`} text="Try a different search or clear your filters." />
                        ) : (
                            <div className="sf-grid">
                                {shown.map((item) => <ProductCard key={item.id} product={item} />)}
                            </div>
                        )}
                        {limit && visible.length > limit && (
                            <div className="text-center mt-4">
                                <Link to="/category" className="sf-btn sf-btn-ghost">View all {visible.length} products</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
