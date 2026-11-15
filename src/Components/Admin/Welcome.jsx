import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../Context/LoginContext";
import { canAccess } from "../../Permissions";
import { formatPrice } from "../../utils";
import { useFetch } from "./CallAPI";
import { CountUp, EmptyState, PageHeader, StatusBadge } from "./ui";

const STATUSES = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = {
    Placed: "#3b82f6",
    Processing: "#f59e0b",
    Shipped: "#8b5cf6",
    Delivered: "#198754",
    Cancelled: "#ef4444",
};

const Welcome = () => {
    const { login } = useContext(LoginContext);
    const products = useFetch("products");
    const orders = useFetch("orders");
    const reviews = useFetch("reviews");
    const enquiries = useFetch("enquires");
    const users = useFetch("users");
    const [today] = useState(() => new Date());

    const loading = [products, orders, reviews, enquiries, users].some((x) => x.loading);

    const data = useMemo(() => {
        const valid = orders.data.filter((o) => Array.isArray(o.items));
        const live = valid.filter((o) => o.status !== "Cancelled");
        const revenue = live.reduce((sum, o) => sum + Number(o.total || 0), 0);

        const statusCounts = Object.fromEntries(STATUSES.map((s) => [s, valid.filter((o) => o.status === s).length]));
        let acc = 0;
        const donut = valid.length
            ? STATUSES.map((s) => {
                  const from = acc;
                  acc += (statusCounts[s] / valid.length) * 100;
                  return `${STATUS_COLORS[s]} ${from}% ${acc}%`;
              }).join(", ")
            : "";

        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });
        const byDay = days.map((d) => ({
            label: d.toLocaleDateString("en-IN", { weekday: "short" }),
            isToday: d.toDateString() === today.toDateString(),
            value: live
                .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
                .reduce((sum, o) => sum + Number(o.total || 0), 0),
        }));
        const weekTotal = byDay.reduce((sum, d) => sum + d.value, 0);
        const maxDay = Math.max(...byDay.map((d) => d.value), 1);

        const sold = {};
        live.forEach((o) =>
            o.items.forEach((i) => {
                sold[i.id] = sold[i.id] || { id: i.id, name: i.name, image: i.image, units: 0 };
                sold[i.id].units += Number(i.quantity || 0);
            })
        );
        const top = Object.values(sold).sort((a, b) => b.units - a.units).slice(0, 5);

        const recent = [...valid].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        const rated = reviews.data.map((r) => Number(r.rating)).filter(Boolean);
        const avgRating = rated.length ? rated.reduce((s, n) => s + n, 0) / rated.length : 0;
        const customers = users.data.filter((u) => u.role === "user").length;

        return { valid, live, revenue, statusCounts, donut, byDay, weekTotal, maxDay, top, recent, avgRating, ratedCount: rated.length, customers };
    }, [orders.data, reviews.data, users.data, today]);

    const hour = today.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const firstName = (login.user?.name || "").split(" ")[0];

    const cards = [
        { label: "Revenue", value: data.revenue, format: (n) => formatPrice(Math.round(n)), icon: "bi-currency-rupee", tone: "green", sub: `${data.live.length} active orders` },
        { label: "Orders", value: data.valid.length, icon: "bi-receipt", tone: "blue", sub: `${data.statusCounts.Placed} waiting to be processed` },
        { label: "Products", value: products.data.length, icon: "bi-box-seam", tone: "amber", sub: "In your catalog" },
        { label: "Customers", value: data.customers, icon: "bi-people", tone: "violet", sub: "Registered accounts" },
        { label: "Reviews", value: data.ratedCount, icon: "bi-star", tone: "rose", sub: data.ratedCount ? `${data.avgRating.toFixed(1)} average rating` : "No ratings yet" },
        { label: "Enquiries", value: enquiries.data.length, icon: "bi-chat-left-text", tone: "teal", sub: "From the contact form" },
    ];

    return (
        <>
            <PageHeader title={`${greeting}${firstName ? `, ${firstName}` : ""}`} subtitle="Here is how your store is doing.">
                {canAccess(login.user, "addproduct") && (
                    <Link to="addproduct" className="btn btn-success"><i className="bi bi-plus-lg me-1"></i>Add product</Link>
                )}
            </PageHeader>

            {loading ? (
                <>
                    <div className="adm-stats">
                        {cards.map((c) => (
                            <div className="adm-card" key={c.label}>
                                <span className="adm-skel mb-2" style={{ width: "50%" }}></span>
                                <span className="adm-skel" style={{ width: "80%", height: "1.6rem" }}></span>
                            </div>
                        ))}
                    </div>
                    <div className="adm-card"><span className="adm-skel" style={{ height: 200 }}></span></div>
                </>
            ) : (
                <>
                    <div className="adm-stats">
                        {cards.map((c, i) => (
                            <div className="adm-card adm-stat" style={{ "--i": i }} key={c.label}>
                                <span className={`adm-ico tone-${c.tone}`}><i className={`bi ${c.icon}`}></i></span>
                                <div className="min-w-0">
                                    <div className="adm-sub">{c.label}</div>
                                    <div className="adm-stat-value"><CountUp value={c.value} format={c.format} /></div>
                                    <div className="adm-sub">{c.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="adm-grid">
                        <div className="adm-card span-8">
                            <div className="d-flex justify-content-between flex-wrap gap-2">
                                <div>
                                    <h3 className="adm-card-title">Revenue, last 7 days</h3>
                                    <div className="adm-sub">Cancelled orders are not counted</div>
                                </div>
                                <div className="fw-bold fs-5">{formatPrice(data.weekTotal)}</div>
                            </div>
                            <div className="adm-bars" role="img" aria-label="Revenue for each of the last 7 days">
                                {data.byDay.map((d, i) => (
                                    <div className="adm-bar-col" key={i} title={`${d.label}: ${formatPrice(d.value)}`}>
                                        <div className="adm-bar-wrap">
                                            <div
                                                className={`adm-bar${d.isToday ? " today" : ""}`}
                                                style={{ "--h": `${Math.max((d.value / data.maxDay) * 100, d.value > 0 ? 6 : 2)}%`, "--i": i }}
                                            ></div>
                                        </div>
                                        <span className="adm-sub">{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="adm-card span-4">
                            <h3 className="adm-card-title">Orders by status</h3>
                            {data.valid.length === 0 ? (
                                <EmptyState icon="bi-pie-chart" title="No orders yet" />
                            ) : (
                                <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
                                    <div className="adm-donut" style={{ background: `conic-gradient(${data.donut})` }}>
                                        <div className="adm-donut-center">
                                            <div>
                                                <div className="fs-4 fw-bold">{data.valid.length}</div>
                                                <div className="adm-sub">orders</div>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="list-unstyled mb-0 flex-grow-1">
                                        {STATUSES.map((s) => (
                                            <li key={s} className="d-flex justify-content-between small py-1">
                                                <span><span className="adm-dot" style={{ background: STATUS_COLORS[s] }}></span>{s}</span>
                                                <strong>{data.statusCounts[s]}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="adm-grid">
                        <div className="adm-card span-7">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h3 className="adm-card-title mb-0">Recent orders</h3>
                                {canAccess(login.user, "vieworders") && <Link to="vieworders" className="small">View all</Link>}
                            </div>
                            {data.recent.length === 0 ? (
                                <EmptyState icon="bi-receipt" title="No orders yet" text="New orders will show up here." />
                            ) : (
                                <div className="adm-table-wrap">
                                    <table className="adm-table">
                                        <thead>
                                            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {data.recent.map((o) => (
                                                <tr key={o.id}>
                                                    <td>
                                                        <strong>#{o.id}</strong>
                                                        <div className="adm-sub">{new Date(o.createdAt).toLocaleDateString("en-IN")}</div>
                                                    </td>
                                                    <td>{o.customerName}</td>
                                                    <td>{formatPrice(o.total)}</td>
                                                    <td><StatusBadge status={o.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="adm-card span-5">
                            <h3 className="adm-card-title">Best sellers</h3>
                            <div className="adm-sub mb-3">By units sold</div>
                            {data.top.length === 0 ? (
                                <EmptyState icon="bi-bag" title="Nothing sold yet" />
                            ) : (
                                data.top.map((p) => (
                                    <div className="d-flex align-items-center gap-3 mb-3" key={p.id}>
                                        <img className="adm-thumb" src={p.image} alt={p.name} />
                                        <div className="flex-grow-1 min-w-0">
                                            <div className="d-flex justify-content-between gap-2">
                                                <span className="text-truncate">{p.name}</span>
                                                <strong>{p.units}</strong>
                                            </div>
                                            <div className="adm-meter mt-1"><span style={{ width: `${(p.units / data.top[0].units) * 100}%` }}></span></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Welcome;
