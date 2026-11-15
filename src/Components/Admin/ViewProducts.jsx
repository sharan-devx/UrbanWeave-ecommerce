import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api";
import { formatPrice } from "../../utils";
import ProductForm from "./ProductForm";
import { EMPTY_PRODUCT, toPayload } from "./productHelpers";
import { EmptyState, PageHeader, TableSkeleton } from "./ui";
import { useToast } from "./toast";

const CATEGORIES = ["All", "Men", "Women", "Kids"];

const discountOf = (p) => (Number(p.originalPrice) > Number(p.price) ? Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100) : 0);

const ViewProducts = () => {
    const toast = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(EMPTY_PRODUCT);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");

    const loadProducts = useCallback(() => {
        api.get("/products")
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products
            .filter((p) => category === "All" || p.category === category)
            .filter((p) => !q || p.name?.toLowerCase().includes(q));
    }, [products, query, category]);

    const deleteProduct = (p) => {
        if (!window.confirm(`Delete "${p.name}"?`)) return;
        api.delete(`/products/${p.id}`)
            .then(() => {
                toast("Product deleted");
                loadProducts();
            })
            .catch((err) => {
                console.error(err);
                toast("Could not delete the product", "danger");
            });
    };

    const getOneProduct = (pid) => {
        api.get(`/products/${pid}`)
            .then((res) => setProduct(res.data))
            .catch((err) => console.error(err));
    };

    const changeProduct = (e) => {
        const { name, value } = e.target;
        setProduct((current) => ({ ...current, [name]: value }));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        api.put(`/products/${product.id}`, toPayload(product))
            .then(() => {
                toast("Product updated");
                loadProducts();
            })
            .catch((err) => {
                console.error(err);
                toast("Could not update the product", "danger");
            });
    };

    return (
        <>
            <PageHeader title="Products" subtitle={`${products.length} products in your catalog`}>
                <div className="adm-search">
                    <i className="bi bi-search"></i>
                    <input className="form-control" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
                </div>
            </PageHeader>

            <div className="d-flex flex-wrap gap-2 mb-3">
                {CATEGORIES.map((c) => (
                    <button key={c} type="button" className={`adm-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
                ))}
            </div>

            <div className="adm-card p-0">
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr><th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th className="text-end">Actions</th></tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={6} cols={5} />
                            ) : (
                                visible.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img className="adm-thumb" src={p.image} alt={p.name} />
                                                <span className="fw-semibold">{p.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-success-subtle text-success-emphasis">{p.category}</span></td>
                                        <td>
                                            <span className="fw-semibold">{formatPrice(p.price)}</span>
                                            {discountOf(p) > 0 && (
                                                <>
                                                    <span className="adm-sub text-decoration-line-through ms-2">{formatPrice(p.originalPrice)}</span>
                                                    <span className="badge bg-danger-subtle text-danger-emphasis ms-2">{discountOf(p)}% off</span>
                                                </>
                                            )}
                                        </td>
                                        <td><i className="bi bi-star-fill text-warning me-1"></i>{p.rating}</td>
                                        <td className="text-end text-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => getOneProduct(p.id)}
                                                data-bs-target="#edit"
                                                data-bs-toggle="modal"
                                                className="adm-icon-btn me-2"
                                                title="Edit"
                                                aria-label={`Edit ${p.name}`}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button type="button" onClick={() => deleteProduct(p)} className="adm-icon-btn danger" title="Delete" aria-label={`Delete ${p.name}`}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && visible.length === 0 && <EmptyState icon="bi-box-seam" title="No products found" text="Try a different category or search term." />}
            </div>

            <div className="modal fade" id="edit" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold">Update product</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ProductForm
                                product={product}
                                onChange={changeProduct}
                                onSubmit={submitHandler}
                                submitProps={{ "data-bs-dismiss": "modal", value: "Update product" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewProducts;
