import React, { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext } from "./toast";

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

    const toast = useCallback(
        (text, type = "success") => {
            const id = nextId.current++;
            setToasts((list) => [...list, { id, text, type }]);
            setTimeout(() => dismiss(id), 3500);
        },
        [dismiss]
    );

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="adm-toasts" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`adm-toast ${t.type}`} role="status">
                        <i className={`bi ${t.type === "danger" ? "bi-exclamation-circle-fill" : "bi-check-circle-fill"}`}></i>
                        <span>{t.text}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const defaultFormat = (n) => Math.round(n).toLocaleString("en-IN");

export const CountUp = ({ value, format = defaultFormat }) => {
    const [n, setN] = useState(0);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const duration = reduce ? 0 : 900;
        let raf;
        let start;
        const tick = (t) => {
            if (start === undefined) start = t;
            const p = duration ? Math.min((t - start) / duration, 1) : 1;
            setN(value * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value]);

    return <>{format(n)}</>;
};

export const StatusBadge = ({ status }) => (
    <span className={`adm-badge adm-${(status || "").toLowerCase()}`}>{status}</span>
);

export const Avatar = ({ name }) => <span className="adm-avatar">{(name || "?").charAt(0).toUpperCase()}</span>;

export const PageHeader = ({ title, subtitle, children }) => (
    <div className="adm-head">
        <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
        </div>
        {children && <div className="adm-head-actions">{children}</div>}
    </div>
);

export const EmptyState = ({ icon = "bi-inbox", title, text }) => (
    <div className="adm-empty">
        <i className={`bi ${icon}`}></i>
        <div className="fw-semibold">{title}</div>
        {text && <div className="small">{text}</div>}
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <>
        {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
                {Array.from({ length: cols }, (_, c) => (
                    <td key={c}><span className="adm-skel" style={{ width: `${60 + ((r + c) % 3) * 15}%` }}></span></td>
                ))}
            </tr>
        ))}
    </>
);
