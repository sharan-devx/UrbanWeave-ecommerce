import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { formatPrice } from "../../utils";
import { Avatar, EmptyState, PageHeader } from "./ui";
import { useToast } from "./toast";

const STATUSES = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

const ViewOrders = () => {
    const toast = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [openId, setOpenId] = useState(null);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        api.get("/orders")
            .then((res) => {
                if (cancelled) return;
                setOrders(res.data.filter((o) => Array.isArray(o.items)));
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                if (cancelled) return;
                setError("Could not load orders. Is the API running?");
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const counts = useMemo(() => {
        const c = { all: orders.length };
        STATUSES.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length; });
        return c;
    }, [orders]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders
            .filter((o) => filter === "all" || o.status === filter)
            .filter((o) => !q || [String(o.id), o.customerName, o.customerEmail].some((v) => v?.toLowerCase().includes(q)))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [orders, filter, query]);

    const updateStatus = async (order, status) => {
        setSavingId(order.id);
        try {
            await api.patch(`/orders/${order.id}`, { status });
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
            toast(`Order #${order.id} marked as ${status}`);
        } catch (err) {
            console.error(err);
            toast("Could not update the order", "danger");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <>
            <PageHeader title="Orders" subtitle={`${orders.length} orders in total`}>
                <div className="adm-search">
                    <i className="bi bi-search"></i>
                    <input
                        className="form-control"
                        placeholder="Search by order, customer or email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search orders"
                    />
                </div>
            </PageHeader>

            <div className="d-flex flex-wrap gap-2 mb-3">
                {["all", ...STATUSES].map((s) => (
                    <button key={s} type="button" className={`adm-chip${filter === s ? " active" : ""}`} onClick={() => setFilter(s)}>
                        {s === "all" ? "All" : s}<small>{counts[s]}</small>
                    </button>
                ))}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                [0, 1, 2].map((i) => (
                    <div className="adm-card mb-3" key={i}>
                        <span className="adm-skel mb-2" style={{ width: "30%" }}></span>
                        <span className="adm-skel" style={{ width: "60%" }}></span>
                    </div>
                ))
            ) : visible.length === 0 && !error ? (
                <div className="adm-card"><EmptyState icon="bi-receipt" title="No orders found" text="Try a different status or search term." /></div>
            ) : (
                visible.map((order) => {
                    const open = openId === order.id;
                    return (
                        <div className="adm-card p-0 mb-3" key={order.id}>
                            <div className="adm-order-row">
                                <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => setOpenId(open ? null : order.id)}
                                    aria-expanded={open}
                                    aria-label={open ? "Hide order details" : "Show order details"}
                                >
                                    <i className={`bi bi-chevron-${open ? "up" : "down"}`}></i>
                                </button>
                                <div className="flex-grow-1">
                                    <strong>Order #{order.id}</strong>
                                    <div className="adm-sub">{new Date(order.createdAt).toLocaleString("en-IN")}</div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Avatar name={order.customerName} />
                                    <div>
                                        <div className="fw-semibold">{order.customerName}</div>
                                        <div className="adm-sub">{order.items.length} item{order.items.length !== 1 && "s"}</div>
                                    </div>
                                </div>
                                <div className="fw-semibold">{formatPrice(order.total)}</div>
                                <select
                                    className={`form-select form-select-sm adm-status-select adm-${order.status.toLowerCase()}`}
                                    value={order.status}
                                    disabled={savingId === order.id}
                                    onChange={(e) => updateStatus(order, e.target.value)}
                                    aria-label={`Status of order ${order.id}`}
                                >
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className={`adm-collapse${open ? " open" : ""}`}>
                                <div>
                                    <div className="adm-order-detail">
                                        <div>
                                            <div className="adm-sub mb-1">Customer</div>
                                            <div className="fw-semibold">{order.customerName}</div>
                                            <div><a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a></div>
                                            <div><a href={`tel:${order.phone}`}>{order.phone}</a></div>
                                            <div className="mt-2 adm-sub">Delivery address</div>
                                            <div>{order.address}</div>
                                            <div className="mt-2 adm-sub">Payment</div>
                                            <div>{order.payment}</div>
                                        </div>
                                        <div>
                                            <div className="adm-sub mb-2">Items</div>
                                            {order.items.map((item) => (
                                                <div key={item.id} className="d-flex align-items-center gap-3 mb-2">
                                                    <img className="adm-thumb" src={item.image} alt={item.name} />
                                                    <div className="flex-grow-1">{item.name} × {item.quantity}</div>
                                                    <div>{formatPrice(item.price * item.quantity)}</div>
                                                </div>
                                            ))}
                                            <div className="text-end fw-bold fs-5 mt-2">Total: {formatPrice(order.total)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </>
    );
};

export default ViewOrders;
