import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "./ui";

const API = "https://urbanweave-api.onrender.com";

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : "";

const Stars = ({ rating }) => (
    <span className="text-warning" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
            <i key={n} className={`bi ${n <= Math.round(rating) ? "bi-star-fill" : "bi-star"}`}></i>
        ))}
    </span>
);

const SORTS = {
    newest: { label: "Newest first", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
    oldest: { label: "Oldest first", fn: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
    highest: { label: "Highest rated", fn: (a, b) => b.rating - a.rating },
    lowest: { label: "Lowest rated", fn: (a, b) => a.rating - b.rating },
};

const ViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState(0); // 0 = all
    const [productFilter, setProductFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [reloadKey, setReloadKey] = useState(0);

useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
        fetch(`${API}/reviews`, { signal }),
        fetch(`${API}/products`, { signal }),
    ])
        .then(async ([rRes, pRes]) => {
            if (!rRes.ok || !pRes.ok) throw new Error("Server returned an error");
            const [rData, pData] = await Promise.all([rRes.json(), pRes.json()]);
            setReviews(rData.map((r) => ({ ...r, rating: Number(r.rating) || 0 })));
            setProducts(pData);
            setLoading(false);
        })
        .catch((err) => {
            if (err.name === "AbortError") return;
            setError("Could not load reviews. Check that the server is running and try again.");
            setLoading(false);
        });

    return () => controller.abort();
}, [reloadKey]);
    const productMap = useMemo(() => {
        const map = {};
        products.forEach((p) => { map[p.id] = p; });
        return map;
    }, [products]);

    const stats = useMemo(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => { if (counts[r.rating] !== undefined) counts[r.rating] += 1; });
        const total = reviews.length;
        const average = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
        return { counts, total, average };
    }, [reviews]);

    const reviewedProducts = useMemo(() => {
        const ids = [...new Set(reviews.map((r) => r.productId))];
        return ids
            .map((id) => ({ id, name: productMap[id]?.name || "Unknown product" }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [reviews, productMap]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return reviews
            .filter((r) => (ratingFilter ? r.rating === ratingFilter : true))
            .filter((r) => (productFilter === "all" ? true : r.productId === productFilter))
            .filter((r) => {
                if (!q) return true;
                const name = productMap[r.productId]?.name || "";
                return [r.comment, r.userName, name].some((v) => v?.toLowerCase().includes(q));
            })
            .sort(SORTS[sortBy].fn);
    }, [reviews, ratingFilter, productFilter, search, sortBy, productMap]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`${API}/reviews/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch {
            setError("Could not delete the review. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setRatingFilter(0);
        setProductFilter("all");
    };
    const filtersActive = search || ratingFilter || productFilter !== "all";

    if (loading) {
        return (
            <div className="p-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading reviews</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Reviews" subtitle="What customers say about your products" />

            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                    <span>{error}</span>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => { setError(""); setLoading(true); setReloadKey((k) => k + 1); }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {stats.total === 0 && !error ? (
                <div className="text-center text-muted py-5">
                    <i className="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                    <p className="mb-0">No reviews yet. They will show up here once customers start reviewing their orders.</p>
                </div>
            ) : stats.total > 0 && (
                <>
                    <div className="adm-card mb-4">
                        <div>
                            <div className="row align-items-center g-4">
                                <div className="col-md-4 text-center">
                                    <div className="display-4 fw-bold">{stats.average.toFixed(1)}</div>
                                    <Stars rating={stats.average} />
                                    <div className="text-muted small mt-1">
                                        {stats.total} review{stats.total !== 1 && "s"} across {reviewedProducts.length} product{reviewedProducts.length !== 1 && "s"}
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const pct = (stats.counts[star] / stats.total) * 100;
                                        const active = ratingFilter === star;
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRatingFilter(active ? 0 : star)}
                                                aria-pressed={active}
                                                className={`btn btn-sm w-100 d-flex align-items-center gap-2 p-1 border-0 ${active ? "bg-success-subtle" : ""}`}
                                            >
                                                <span className="text-nowrap" style={{ width: "2.5rem" }}>
                                                    {star} <i className="bi bi-star-fill text-warning"></i>
                                                </span>
                                                <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                                    <div className="progress-bar bg-success" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="text-muted text-end" style={{ width: "2rem" }}>{stats.counts[star]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-md-5">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text"><i className="bi bi-search"></i></span>
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search by customer, product or comment"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search reviews"
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select form-select-sm"
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
                                aria-label="Filter by product"
                            >
                                <option value="all">All products</option>
                                {reviewedProducts.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select form-select-sm"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                aria-label="Sort reviews"
                            >
                                {Object.entries(SORTS).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="text-muted small mb-2">
                        Showing {visible.length} of {stats.total}
                        {filtersActive && (
                            <button type="button" className="btn btn-link btn-sm py-0" onClick={clearFilters}>
                                Clear filters
                            </button>
                        )}
                    </div>

                    {visible.length === 0 ? (
                        <p className="text-muted py-4 text-center">No reviews match your filters.</p>
                    ) : (
                        <ul className="list-unstyled mb-0">
                            {visible.map((r) => {
                                const product = productMap[r.productId];
                                return (
                                    <li key={r.id} className="adm-card mb-3">
                                        <div className="d-flex gap-3">
                                            {product?.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="rounded flex-shrink-0"
                                                    style={{ width: "72px", height: "72px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    className="rounded bg-light d-flex align-items-center justify-content-center text-muted flex-shrink-0"
                                                    style={{ width: "72px", height: "72px" }}
                                                >
                                                    <i className="bi bi-image"></i>
                                                </div>
                                            )}

                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start gap-2">
                                                    <div>
                                                        <strong>{product?.name || "Unknown product"}</strong>
                                                        {product?.category && (
                                                            <span className="badge bg-success-subtle text-success-emphasis ms-2">{product.category}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDelete(r.id)}
                                                        disabled={deletingId === r.id}
                                                        title="Delete review"
                                                        aria-label="Delete review"
                                                    >
                                                        {deletingId === r.id
                                                            ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                                            : <i className="bi bi-trash"></i>}
                                                    </button>
                                                </div>

                                                <div className="my-1">
                                                    <Stars rating={r.rating} />
                                                    <span className="text-muted small ms-2">
                                                        by {r.userName || "Anonymous"}
                                                        {r.createdAt && `, ${formatDate(r.createdAt)}`}
                                                    </span>
                                                </div>

                                                {r.comment && <p className="mb-0">{r.comment}</p>}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default ViewReviews;
