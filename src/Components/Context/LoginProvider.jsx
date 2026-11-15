import { useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";

const STORAGE_KEY = "urbanweave-login";
const LOGGED_OUT = { status: false, user: null };

const readStoredLogin = () => {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || LOGGED_OUT;
    } catch {
        return LOGGED_OUT;
    }
};

export function LoginProvider({ children }) {
    const [login, setLogin] = useState(readStoredLogin);

    // Keep the admin logged in across page refreshes (until the tab is closed).
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(login));
    }, [login]);

    return (
        <LoginContext.Provider value={{ login, setLogin }}>
            {children}
        </LoginContext.Provider>
    );
}
