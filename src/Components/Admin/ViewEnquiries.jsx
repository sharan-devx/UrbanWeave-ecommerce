import React, { useMemo, useState } from "react";
import { useFetch } from "./CallAPI";
import { Avatar, EmptyState, PageHeader } from "./ui";

const ViewEnquiries = () => {
    const { data: enquiries, loading } = useFetch("enquires");
    const [query, setQuery] = useState("");

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return enquiries.filter((e) => !q || [e.name, e.email, e.subject, e.message].some((v) => v?.toLowerCase().includes(q)));
    }, [enquiries, query]);

    return (
        <>
            <PageHeader title="Enquiries" subtitle={`${enquiries.length} messages from the contact form`}>
                <div className="adm-search">
                    <i className="bi bi-search"></i>
                    <input className="form-control" placeholder="Search enquiries" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search enquiries" />
                </div>
            </PageHeader>

            {loading ? (
                [0, 1, 2].map((i) => (
                    <div className="adm-card mb-3" key={i}>
                        <span className="adm-skel mb-2" style={{ width: "30%" }}></span>
                        <span className="adm-skel" style={{ width: "70%" }}></span>
                    </div>
                ))
            ) : visible.length === 0 ? (
                <div className="adm-card"><EmptyState icon="bi-chat-left-text" title="No enquiries" text="Messages from your contact page will appear here." /></div>
            ) : (
                visible.map((q) => (
                    <div className="adm-card mb-3 d-flex gap-3" key={q.id}>
                        <Avatar name={q.name} />
                        <div className="flex-grow-1 min-w-0">
                            <div className="d-flex justify-content-between flex-wrap gap-2">
                                <div>
                                    <div className="fw-semibold">{q.subject || "No subject"}</div>
                                    <div className="adm-sub">{q.name} · {q.email}</div>
                                </div>
                                <a
                                    className="btn btn-outline-success btn-sm align-self-start"
                                    href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: ${q.subject || "Your enquiry"}`)}`}
                                >
                                    <i className="bi bi-reply me-1"></i>Reply
                                </a>
                            </div>
                            <p className="mb-0 mt-2" style={{ whiteSpace: "pre-wrap" }}>{q.message}</p>
                        </div>
                    </div>
                ))
            )}
        </>
    );
};

export default ViewEnquiries;
