import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { formatPrice } from "../../utils";
import { Avatar, EmptyState, PageHeader, StatusBadge, TableSkeleton } from "./ui";
import { useToast } from "./toast";

const formatDate = (value) => (value ? new Date(value).toLocaleString("en-IN") : "Never");

const ViewUsers = () => {
    const toast = useToast();
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        Promise.all([api.get("/users", { params: { role: "user" } }), api.get("/orders")])
            .then(([u, o]) => {
                if (cancelled) return;
                setCustomers(u.data);
                setOrders(o.data.filter((x) => Array.isArray(x.items)));
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                if (cancelled) return;
                setError("Could not load customers. Is the API running?");
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const ordersOf = (id) => orders.filter((o) => o.userId === id);

    const visible = useMemo(() => {
        const term = search.trim().toLowerCase();
        return customers.filter((u) => !term || u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term));
    }, [customers, search]);

    const selected = customers.find((u) => u.id === selectedId) || null;
    const selectedOrders = selected ? ordersOf(selected.id) : [];

    const deleteUser = (u) => {
        if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
        api.delete(`/users/${u.id}`)
            .then(() => {
                if (selectedId === u.id) setSelectedId(null);
                toast(`${u.name} was deleted`);
                setReloadKey((k) => k + 1);
            })
            .catch((err) => {
                console.error(err);
                toast("Could not delete the customer", "danger");
            });
    };

    return (
        <>
            <PageHeader title="Customers" subtitle={`${customers.length} registered customers`}>
                <div className="adm-search">
                    <i className="bi bi-search"></i>
                    <input className="form-control" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search customers" />
                </div>
            </PageHeader>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="adm-card p-0">
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr><th>Customer</th><th>Orders</th><th>Total spent</th><th>Last login</th><th className="text-end">Actions</th></tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={5} cols={5} />
                            ) : (
                                visible.map((u) => {
                                    const mine = ordersOf(u.id);
                                    const spent = mine.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + Number(o.total || 0), 0);
                                    return (
                                        <tr key={u.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <Avatar name={u.name} />
                                                    <div>
                                                        <div className="fw-semibold">{u.name}</div>
                                                        <div className="adm-sub">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{mine.length}</td>
                                            <td>{formatPrice(spent)}</td>
                                            <td className="adm-sub">{formatDate(u.lastLogin)}</td>
                                            <td className="text-end text-nowrap">
                                                <button type="button" className="adm-icon-btn me-2" onClick={() => setSelectedId(u.id)} title="View details" aria-label={`View ${u.name}`}>
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button type="button" className="adm-icon-btn danger" onClick={() => deleteUser(u)} title="Delete" aria-label={`Delete ${u.name}`}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && visible.length === 0 && <EmptyState icon="bi-people" title="No customers found" />}
            </div>

            {selected && (
                <>
                    <div className="adm-drawer-back" onClick={() => setSelectedId(null)}></div>
                    <aside className="adm-drawer" role="dialog" aria-label={`${selected.name} details`}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="d-flex align-items-center gap-3">
                                <Avatar name={selected.name} />
                                <div>
                                    <h4 className="mb-0 fs-5">{selected.name}</h4>
                                    <span className="adm-sub">{selected.email}</span>
                                </div>
                            </div>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedId(null)}></button>
                        </div>
                        <hr />
                        <div className="mb-1"><span className="adm-sub">Phone</span><div>{selected.phone || "Not provided"}</div></div>
                        <div className="mb-3"><span className="adm-sub">Address</span><div>{selected.address || "Not provided"}</div></div>

                        <h5 className="fs-6 fw-bold">Orders ({selectedOrders.length})</h5>
                        {selectedOrders.length === 0 ? (
                            <p className="adm-sub">No orders yet.</p>
                        ) : (
                            selectedOrders.map((o) => (
                                <div className="border rounded-3 p-3 mb-2" style={{ borderColor: "var(--line)" }} key={o.id}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong>#{o.id}</strong>
                                        <StatusBadge status={o.status} />
                                    </div>
                                    <div className="adm-sub mb-1">{new Date(o.createdAt).toLocaleString("en-IN")}</div>
                                    {o.items.map((i) => <div key={i.id}>{i.name} × {i.quantity}</div>)}
                                    <div className="text-end fw-bold">{formatPrice(o.total)}</div>
                                </div>
                            ))
                        )}
                    </aside>
                </>
            )}
        </>
    );
};

export default ViewUsers;
