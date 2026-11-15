import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UrbanWeave from "./Assets/UrbanWeave.png";
import NewArrival from "./Assets/NewArrival.png";
import Men from "./Assets/Men.png";
import Women from "./Assets/Women.png";
import Kids from "./Assets/Kids.png";
import banner1 from "./Assets/banner-1.jpg";
import banner2 from "./Assets/banner-2.avif";
import banner3 from "./Assets/banner-3.jpg";
import banner4 from "./Assets/banner-4.avif";
import banner5 from "./Assets/banner-5.avif";
import Products from "./Products";

const SLIDES = [
    { bg: banner1, img: UrbanWeave, title: "Urban Style, Reimagined", text: "Discover fashion that blends street culture with modern comfort.", cta: "Shop Now", to: "/category" },
    { bg: banner2, img: NewArrival, title: "New Drop is Here", text: "Fresh fits. Bold vibes. Designed for your everyday hustle.", cta: "Explore Collection", to: "/category" },
    { bg: banner3, img: Men, title: "Sharp Looks. Everyday Comfort", text: "Upgrade your wardrobe with styles made for confidence and movement.", cta: "Shop Men", to: "/men" },
    { bg: banner4, img: Women, title: "Elegance Meets Street Style", text: "From casual to chic, find outfits that match your vibe.", cta: "Shop Women", to: "/women" },
    { bg: banner5, img: Kids, title: "Playful Styles for Little Stars", text: "Comfortable, colorful, and made for every adventure.", cta: "Shop Kids", to: "/kids" },
];

const TILES = [
    { to: "/men", title: "Men", text: "Sharp, easy fits", img: Men, tone: "men" },
    { to: "/women", title: "Women", text: "Casual to chic", img: Women, tone: "women" },
    { to: "/kids", title: "Kids", text: "Built for adventure", img: Kids, tone: "kids" },
];

const PERKS = [
    { icon: "bi-truck", title: "Free delivery", text: "On all orders above ₹999" },
    { icon: "bi-arrow-repeat", title: "Easy returns", text: "7-day hassle-free policy" },
    { icon: "bi-shield-check", title: "Secure payment", text: "Trusted payment methods" },
    { icon: "bi-cash-coin", title: "Cash on delivery", text: "Pay when it arrives" },
];

const Hero = () => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const last = SLIDES.length - 1;

    useEffect(() => {
        if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const timer = setInterval(() => setIndex((i) => (i === last ? 0 : i + 1)), 6000);
        return () => clearInterval(timer);
    }, [paused, index, last]);

    return (
        <>
            <section
                className="sf-hero"
                aria-roledescription="carousel"
                aria-label="Featured collections"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {SLIDES.map((s, i) => (
                    <div
                        key={s.title}
                        className={`sf-slide${i === index ? " active" : ""}`}
                        style={{ backgroundImage: `url(${s.bg})` }}
                        aria-hidden={i !== index}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} of ${SLIDES.length}`}
                    >
                        <div className="sf-slide-in">
                            <div className="sf-slide-copy">
                                <h2>{s.title}</h2>
                                <p>{s.text}</p>
                                <Link className="sf-btn sf-btn-accent" to={s.to} tabIndex={i === index ? 0 : -1}>{s.cta}</Link>
                            </div>
                            <img className="sf-slide-img" src={s.img} alt="" />
                        </div>
                    </div>
                ))}

                <button type="button" className="sf-hero-arrow prev" onClick={() => setIndex(index === 0 ? last : index - 1)} aria-label="Previous slide">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <button type="button" className="sf-hero-arrow next" onClick={() => setIndex(index === last ? 0 : index + 1)} aria-label="Next slide">
                    <i className="bi bi-chevron-right"></i>
                </button>
                <div className="sf-dots">
                    {SLIDES.map((s, i) => (
                        <button key={s.title} type="button" className={i === index ? "on" : ""} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === index}></button>
                    ))}
                </div>
            </section>

            <section className="sf-perks">
                <div className="sf-container sf-perks-grid">
                    {PERKS.map((p) => (
                        <div className="sf-perk" key={p.title}>
                            <i className={`bi ${p.icon}`}></i>
                            <div>
                                <strong>{p.title}</strong>
                                <span>{p.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="sf-section pb-0">
                <div className="sf-container">
                    <div className="sf-sechead">
                        <div>
                            <h2>Shop by category</h2>
                            <p>Find your fit, whoever it is for.</p>
                        </div>
                    </div>
                    <div className="sf-tiles">
                        {TILES.map((t) => (
                            <Link key={t.title} to={t.to} className={`sf-tile ${t.tone}`}>
                                <div>
                                    <h3>{t.title}</h3>
                                    <span>{t.text}</span>
                                    <em>Shop {t.title} <i className="bi bi-arrow-up-right"></i></em>
                                </div>
                                <img src={t.img} alt="" loading="lazy" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Products heading="Shop the collection" subheading="Everything new at UrbanWeave" limit={8} />
        </>
    );
};

export default Hero;
