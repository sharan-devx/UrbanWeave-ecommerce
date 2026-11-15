import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api";
import { LoginContext } from "./Context/LoginContext";
import banner from "./Assets/banner-4.avif";

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { login, setLogin } = useContext(LoginContext);

    if (login.status) {
        const isStaff = ["admin", "employee"].includes(login.user?.role);
        return <Navigate to={isStaff ? "/dashboard" : "/"} replace />;
    }

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setSubmitting(true);
        try {
            const { data: existing } = await api.get("/users", { params: { email: form.email } });
            if (existing.length > 0) {
                setError("An account with this email already exists");
                setSubmitting(false);
                return;
            }
            const { data } = await api.post("/users", { ...form, role: "user" });
            const { password: _password, ...user } = data;
            setLogin({ status: true, user });
        } catch (err) {
            console.error(err);
            setError("Could not register. Is the API running?");
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
                            <h2>Join the movement</h2>
                            <p>Create an account to track orders, save favourites and check out faster.</p>
                        </div>
                    </div>

                    <div className="sf-auth-form">
                        <h1>Create account</h1>
                        <p className="sf-muted">It takes less than a minute.</p>
                        <form onSubmit={submit}>
                            <label className="sf-field">
                                <span>Full name</span>
                                <input name="name" value={form.name} onChange={change} className="sf-input" autoComplete="name" required />
                            </label>
                            <label className="sf-field">
                                <span>Email address</span>
                                <input type="email" name="email" value={form.email} onChange={change} className="sf-input" autoComplete="email" required />
                            </label>
                            <label className="sf-field">
                                <span>Password</span>
                                <div className="sf-pass">
                                    <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={change} className="sf-input" placeholder="At least 6 characters" autoComplete="new-password" required />
                                    <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </button>
                                </div>
                            </label>
                            {error && <div className="sf-alert danger" role="alert">{error}</div>}
                            <button type="submit" className="sf-btn w-100" disabled={submitting}>{submitting ? "Creating account..." : "Register"}</button>
                        </form>
                        <p className="sf-auth-switch">Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
