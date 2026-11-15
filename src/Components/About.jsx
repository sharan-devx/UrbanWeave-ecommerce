import React from "react";
import { Link } from "react-router-dom";
import { PageHero } from "./Store/ui";
import bg from "./Assets/AboutBackground.jpeg";

const FEATURES = [
    { icon: "bi-gem", title: "Premium quality", text: "Crafted with high-quality materials for durability and comfort." },
    { icon: "bi-lightning-charge", title: "Trend driven", text: "Inspired by the latest streetwear and global fashion trends." },
    { icon: "bi-wallet2", title: "Affordable", text: "Fashion that looks premium without the premium price." },
    { icon: "bi-truck", title: "Fast delivery", text: "Quick and reliable shipping to your doorstep." },
];

export default function About() {
    return (
        <>
            <PageHero title="About UrbanWeave" text="Woven for the streets. Designed for your lifestyle." image={bg} />

            <section className="sf-section">
                <div className="sf-container sf-story">
                    <h2>Our story</h2>
                    <p>
                        UrbanWeave was born from a passion for street culture and modern fashion. We believe
                        clothing is more than just fabric: it is a statement of identity. Our goal is to bring
                        stylish, comfortable, and affordable fashion to everyone.
                    </p>
                </div>
            </section>

            <section className="sf-section pt-0">
                <div className="sf-container sf-two-card">
                    <div className="sf-feature big">
                        <span className="sf-ico"><i className="bi bi-bullseye"></i></span>
                        <h3>Our mission</h3>
                        <p>To deliver high-quality fashion that blends comfort, style, and affordability.</p>
                    </div>
                    <div className="sf-feature big alt">
                        <span className="sf-ico"><i className="bi bi-eye"></i></span>
                        <h3>Our vision</h3>
                        <p>To become a leading streetwear brand that inspires confidence and individuality.</p>
                    </div>
                </div>
            </section>

            <section className="sf-section pt-0">
                <div className="sf-container">
                    <h2 className="sf-h2 text-center">Why choose UrbanWeave?</h2>
                    <div className="sf-feature-grid">
                        {FEATURES.map((f) => (
                            <div className="sf-feature" key={f.title}>
                                <span className="sf-ico"><i className={`bi ${f.icon}`}></i></span>
                                <h3>{f.title}</h3>
                                <p>{f.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="sf-section pt-0">
                <div className="sf-container sf-story">
                    <h2>Our team</h2>
                    <p>
                        We are a group of creative designers, developers, and fashion enthusiasts working
                        together to bring you the best styles.
                    </p>
                </div>
            </section>

            <section className="sf-section pt-0">
                <div className="sf-container">
                    <div className="sf-cta">
                        <h2>Join the UrbanWeave movement</h2>
                        <p>Upgrade your wardrobe with styles that define you.</p>
                        <Link to="/category" className="sf-btn sf-btn-accent">Shop now</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
