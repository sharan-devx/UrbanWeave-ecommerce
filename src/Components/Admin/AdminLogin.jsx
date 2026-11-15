import React, { useContext, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import api from "../../api";
import { LoginContext } from "../Context/LoginContext";
import banner from "../Assets/banner-3.jpg";

const AdminLogin = () => {
    const [details, setDetails] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, setLogin } = useContext(LoginContext);
    const location = useLocation();
    // RequireAuth sends people here with the page they were trying to open.
    const returnTo = location.state?.from?.pathname || "/";

    if (login.status) {
        const isStaff = ["admin", "employee"].includes(login.user?.role);
        return <Navigate to={isStaff ? "/dashboard" : returnTo} replace />;
    }

    const changeDetails = (e) => {
        const { name, value } = e.target;
        setDetails((current) => ({ ...current, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const { data } = await api.get("/users", { params: details });
            if (data.length > 0) {
                api.patch(`/users/${data[0].id}`, { lastLogin: new Date().toISOString() }).catch(() => {});
                const { password: _password, ...user } = data[0];
                setLogin({ status: true, user }); // the redirect above handles the rest
            } else {
                setError("Invalid email or password");
                setSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            setError("Could not reach the server. Is the API running?");
            setSubmitting(false);
        }
    };

    return (
        <section className="sf-section">
            <div className="sf-container">
                <div className="sf-auth">
                    <div className="sf-auth-art" style={{ backgroundImage: `linear-gradient(rgba(8,26,20,.55), rgba(8,26,20,.8)), url(${banner})` }}>
                        <div className="sf-logo">Urban<em>Weave</em></div>
                        <div>
                            <h2>Welcome back</h2>
                            <p>Sign in to see your orders, wishlist and faster checkout.</p>
                        </div>
                    </div>

                    <div className="sf-auth-form">
                        <h1>Login</h1>
                        <p className="sf-muted">Good to see you again.</p>
                        <form onSubmit={submitHandler}>
                            <label className="sf-field">
                                <span>Email address</span>
                                <input type="email" name="email" value={details.email} onChange={changeDetails} className="sf-input" autoComplete="email" required />
                            </label>
                            <label className="sf-field">
                                <span>Password</span>
                                <div className="sf-pass">
                                    <input type={showPassword ? "text" : "password"} name="password" value={details.password} onChange={changeDetails} className="sf-input" autoComplete="current-password" required />
                                    <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </button>
                                </div>
                            </label>
                            {error && <div className="sf-alert danger" role="alert">{error}</div>}
                            <button type="submit" className="sf-btn w-100" disabled={submitting}>{submitting ? "Checking..." : "Login"}</button>
                        </form>
                        <p className="sf-auth-switch">New here? <Link to="/register">Create an account</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
