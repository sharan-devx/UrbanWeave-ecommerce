import React, { useCallback, useRef, useState } from "react";
import { StoreToastContext } from "./storeToast";

export function StoreToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

    const toast = useCallback(
        (text, type = "success") => {
            const id = nextId.current++;
            setToasts((list) => [...list.slice(-2), { id, text, type }]);
            setTimeout(() => dismiss(id), 3000);
        },
        [dismiss]
    );

    return (
        <StoreToastContext.Provider value={toast}>
            {children}
            <div className="sf-toasts" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`sf-toast ${t.type}`} role="status">
                        <i className={`bi ${t.type === "danger" ? "bi-exclamation-circle-fill" : "bi-check-circle-fill"}`}></i>
                        <span>{t.text}</span>
                    </div>
                ))}
            </div>
        </StoreToastContext.Provider>
    );
}
