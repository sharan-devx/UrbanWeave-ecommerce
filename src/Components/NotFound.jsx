import React from "react";
import { Link } from "react-router-dom";
import PageNotFound from "./Assets/PageNotFound.jpg";

const NotFound = () => (
    <section className="sf-section">
        <div className="sf-container sf-nf">
            <img src={PageNotFound} alt="" />
            <div>
                <div className="sf-nf-code">404</div>
                <h1>This page wandered off</h1>
                <p>We are sorry, the page you requested could not be found.</p>
                <Link to="/" className="sf-btn">Back to home</Link>
            </div>
        </div>
    </section>
);

export default NotFound;
