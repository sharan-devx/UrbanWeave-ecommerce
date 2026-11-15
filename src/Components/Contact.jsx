import React, { useState } from "react";
import SendEnquiries from "./SendEnquiries";
import { PageHero } from "./Store/ui";
import { useStoreToast } from "./Store/storeToast";

const INFO = [
    { icon: "bi-geo-alt", title: "Address", lines: ["UrbanWeave Fashion Hub", "Hyderabad, India"] },
    { icon: "bi-telephone", title: "Phone", lines: ["+91 98765 43210", "Mon - Sat | 9AM - 8PM"] },
    { icon: "bi-envelope-at", title: "Email", lines: ["support@urbanweave.com", "help@urbanweave.com"] },
];

const FAQS = [
    { q: "How long does delivery take?", a: "Orders are usually delivered within 3-7 business days." },
    { q: "Do you offer returns?", a: "Yes, we offer easy 7-day returns on eligible products." },
    { q: "Can I track my order?", a: "Yes, tracking details are shared after shipping. You can also follow progress from My Orders." },
];

const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export default function Contact() {
    const toast = useStoreToast();
    const [openFaq, setOpenFaq] = useState(0);
    const [email, setEmail] = useState("");

    const subscribe = (e) => {
        e.preventDefault();
        if (!EMAIL_PATTERN.test(email)) {
            toast("Please enter a valid email address", "danger");
            return;
        }
        setEmail("");
        toast("Thanks for subscribing!");
    };

    return (
        <>
            <PageHero title="Get in touch" text="Questions about products, orders or collaborations? We would love to hear from you." gradient="linear-gradient(135deg, #0f2e24, #198754)" />

            <section className="sf-section">
                <div className="sf-container">
                    <div className="sf-info-grid">
                        {INFO.map((c) => (
                            <div className="sf-info" key={c.title}>
                                <span className="sf-ico"><i className={`bi ${c.icon}`}></i></span>
                                <h3>{c.title}</h3>
                                {c.lines.map((l) => <p key={l}>{l}</p>)}
                            </div>
                        ))}
                    </div>

                    <div className="sf-contact-grid">
                        <div className="sf-panel">
                            <h2>Send us a message</h2>
                            <p className="sf-muted">We usually reply within one business day.</p>
                            <SendEnquiries />
                        </div>

                        <div>
                            <h2 className="sf-h2">Frequently asked questions</h2>
                            {FAQS.map((f, i) => {
                                const open = openFaq === i;
                                return (
                                    <div className={`sf-faq${open ? " open" : ""}`} key={f.q}>
                                        <button type="button" onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open}>
                                            {f.q}<i className="bi bi-plus-lg"></i>
                                        </button>
                                        <div className="sf-faq-body"><div><p>{f.a}</p></div></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="sf-news">
                        <div>
                            <h2>Stay updated</h2>
                            <p>Subscribe to get updates on new arrivals and offers.</p>
                        </div>
                        <form onSubmit={subscribe} noValidate>
                            <input type="email" className="sf-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
                            <button type="submit" className="sf-btn sf-btn-accent">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
