import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LoginContext } from "./Context/LoginContext";
import { CartContext } from "./Context/CartContext";
import { useWishlist } from "./Store/wishlist";

const NAV = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/category", label: "Category" },
    { to: "/men", label: "Men" },
    { to: "/women", label: "Women" },
    { to: "/kids", label: "Kids" },
];

const Header = () => {
    const { login, setLogin } = useContext(LoginContext);
    const { cartCount } = useContext(CartContext);
    const { count: wishCount } = useWishlist();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dismiss = () => setMenuOpen(false);

    const role = login.user?.role;
    const isStaff = role === "admin" || role === "employee";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`sf-header${scrolled ? " scrolled" : ""}`}>
            <div className="sf-header-in">
                <Link className="sf-logo" to="/" onClick={dismiss}>Urban<em>Weave</em></Link>

                <nav className={`sf-nav${menuOpen ? " open" : ""}`} aria-label="Main">
                    {NAV.map((n) => (
                        <NavLink key={n.to} to={n.to} end={n.end} onClick={dismiss}>{n.label}</NavLink>
                    ))}
                </nav>

                <div className="sf-actions">
                    <Link className="sf-icon-link" to="/contact" title="Contact" aria-label="Contact" onClick={dismiss}>
                        <i className="bi bi-telephone"></i>
                    </Link>
                    <Link className="sf-icon-link" to="/wishlist" title="Wishlist" aria-label="Wishlist" onClick={dismiss}>
                        <i className="bi bi-heart"></i>
                        {wishCount > 0 && <span key={wishCount} className="sf-badge">{wishCount}</span>}
                    </Link>
                    <Link className="sf-icon-link" to="/cart" title="Cart" aria-label="Cart" onClick={dismiss}>
                        <i className="bi bi-bag"></i>
                        {cartCount > 0 && <span key={cartCount} className="sf-badge">{cartCount}</span>}
                    </Link>
                    {login.status && (
                        <Link className="sf-icon-link" to="/profile" title="Profile" aria-label="Profile" onClick={dismiss}>
                            <i className="bi bi-person-circle"></i>
                        </Link>
                    )}
                    {login.status && role === "user" && (
                        <Link className="sf-icon-link" to="/orders" title="My Orders" aria-label="My Orders" onClick={dismiss}>
                            <i className="bi bi-box-seam"></i>
                        </Link>
                    )}
                    {isStaff && (
                        <Link className="sf-icon-link" to="/dashboard" title="Dashboard" aria-label="Dashboard" onClick={dismiss}>
                            <i className="bi bi-speedometer2"></i>
                        </Link>
                    )}
                    {login.status ? (
                        <button
                            type="button"
                            className="sf-icon-link sf-out"
                            onClick={() => { setLogin({ status: false, user: null }); dismiss(); }}
                            title="Logout"
                            aria-label="Logout"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                        </button>
                    ) : (
                        <Link className="sf-icon-link sf-in" to="/login" title="Login" aria-label="Login" onClick={dismiss}>
                            <i className="bi bi-box-arrow-in-right"></i>
                        </Link>
                    )}
                    <button
                        type="button"
                        className="sf-icon-link sf-burger"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                    >
                        <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
