import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LoginContext } from "../Context/LoginContext";
import { canAccess, POSITIONS } from "../../Permissions";
import { Avatar, ToastProvider } from "./ui";
import "./admin.css";

const GROUPS = [
    {
        title: "Catalog",
        links: [
            { to: "addproduct", page: "addproduct", label: "Add Product", icon: "bi-plus-square" },
            { to: "viewproducts", page: "viewproducts", label: "Products", icon: "bi-box-seam" },
        ],
    },
    {
        title: "Sales",
        links: [
            { to: "vieworders", page: "vieworders", label: "Orders", icon: "bi-receipt" },
            { to: "viewusers", page: "viewusers", label: "Customers", icon: "bi-people" },
        ],
    },
    {
        title: "Team and feedback",
        links: [
            { to: "employees", page: "employees", label: "Employees", icon: "bi-person-badge" },
            { to: "viewreviews", page: "viewreviews", label: "Reviews", icon: "bi-star" },
            { to: "viewenquiries", page: "viewenquiries", label: "Enquiries", icon: "bi-chat-left-text" },
        ],
    },
];

const ALL_LINKS = GROUPS.flatMap((g) => g.links);

const readDark = () => {
    try {
        return localStorage.getItem("adm-dark") === "1";
    } catch {
        return false;
    }
};

const DashBoard = () => {
    const { login, setLogin } = useContext(LoginContext);
    const user = login.user;
    const { pathname } = useLocation();

    const [sideOpen, setSideOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dark, setDark] = useState(readDark);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [menuOpen]);

    const toggleDark = () => {
        setDark((d) => {
            try {
                localStorage.setItem("adm-dark", d ? "0" : "1");
            } catch {
                /* storage unavailable, keep the setting for this session only */
            }
            return !d;
        });
    };

    const roleLabel = user?.role === "admin" ? "Admin" : POSITIONS[user?.position] || "Employee";
    const current = ALL_LINKS.find((l) => pathname.endsWith(`/${l.to}`));
    const closeSide = () => setSideOpen(false);

    return (
        <div className={`adm${dark ? " dark" : ""}`}>
            <ToastProvider>
                {sideOpen && <div className="adm-backdrop" onClick={closeSide}></div>}

                <aside className={`adm-side${sideOpen ? " open" : ""}`}>
                    <div className="adm-brand">
                        <span className="adm-brand-mark">U</span>
                        <span>Urban<em>Weave</em></span>
                    </div>

                    <nav className="adm-nav" aria-label="Dashboard">
                        <NavLink to="" end onClick={closeSide}>
                            <i className="bi bi-grid-1x2"></i>Overview
                        </NavLink>
                        {GROUPS.map((group) => {
                            const visible = group.links.filter((l) => canAccess(user, l.page));
                            if (visible.length === 0) return null;
                            return (
                                <div key={group.title}>
                                    <div className="adm-nav-label">{group.title}</div>
                                    {visible.map((l) => (
                                        <NavLink key={l.to} to={l.to} onClick={closeSide}>
                                            <i className={`bi ${l.icon}`}></i>{l.label}
                                        </NavLink>
                                    ))}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="adm-side-foot">
                        <Avatar name={user?.name} />
                        <div className="text-truncate">
                            <div className="text-white text-truncate">{user?.name}</div>
                            <small>{roleLabel}</small>
                        </div>
                    </div>
                </aside>

                <div className="adm-main">
                    <header className="adm-top">
                        <button type="button" className="adm-icon-btn adm-burger" onClick={() => setSideOpen(true)} aria-label="Open menu">
                            <i className="bi bi-list fs-5"></i>
                        </button>
                        <h1>{current?.label || "Overview"}</h1>

                        <div className="ms-auto d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="adm-icon-btn"
                                onClick={toggleDark}
                                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                <i className={`bi ${dark ? "bi-sun" : "bi-moon-stars"}`}></i>
                            </button>

                            <div className="adm-drop" ref={menuRef}>
                                <button
                                    type="button"
                                    className="adm-drop-btn"
                                    onClick={() => setMenuOpen((o) => !o)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                >
                                    <Avatar name={user?.name} />
                                    <span className="d-none d-sm-inline">{user?.name}</span>
                                    <i className={`bi bi-chevron-${menuOpen ? "up" : "down"} small`}></i>
                                </button>
                                {menuOpen && (
                                    <div className="adm-drop-menu" role="menu">
                                        <div className="adm-drop-head">
                                            <div className="fw-semibold">{user?.name}</div>
                                            <div className="adm-sub">{user?.email}</div>
                                            <div className="adm-sub">{roleLabel}</div>
                                        </div>
                                        <Link to="/" onClick={() => setMenuOpen(false)}><i className="bi bi-shop"></i>Back to store</Link>
                                        <Link to="/profile" onClick={() => setMenuOpen(false)}><i className="bi bi-person-circle"></i>My profile</Link>
                                        <button type="button" onClick={() => setLogin({ status: false, user: null })}>
                                            <i className="bi bi-box-arrow-right"></i>Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="adm-content">
                        <div className="adm-page" key={pathname}>
                            <Outlet />
                        </div>
                    </main>
                </div>
            </ToastProvider>
        </div>
    );
};

export default DashBoard;
