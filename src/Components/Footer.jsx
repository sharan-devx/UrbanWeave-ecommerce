import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="sf-footer">
        <div className="sf-container sf-footer-grid">
            <div>
                <div className="sf-logo">Urban<em>Weave</em></div>
                <p>Woven for the streets. Designed for your lifestyle.</p>
            </div>
            <div>
                <h4>Shop</h4>
                <Link to="/category">All products</Link>
                <Link to="/men">Men</Link>
                <Link to="/women">Women</Link>
                <Link to="/kids">Kids</Link>
            </div>
            <div>
                <h4>Help</h4>
                <Link to="/orders">My orders</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/contact">Contact us</Link>
                <Link to="/about">About</Link>
            </div>
            <div>
                <h4>Reach us</h4>
                <span><i className="bi bi-geo-alt me-2"></i>Hyderabad, India</span>
                <span><i className="bi bi-telephone me-2"></i>+91 98765 43210</span>
                <span><i className="bi bi-envelope-at me-2"></i>support@urbanweave.com</span>
            </div>
        </div>
        <div className="sf-footer-bar">Designed and Developed by Sharan</div>
    </footer>
);

export default Footer;
