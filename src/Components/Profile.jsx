import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { LoginContext } from "./Context/LoginContext";
import { useStoreToast } from "./Store/storeToast";

const Profile = () => {
    const { login, setLogin } = useContext(LoginContext);
    const toast = useStoreToast();
    const user = login.user;

    const [form, setForm] = useState({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
        newPassword: "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarFailed, setAvatarFailed] = useState(false);

    const change = (e) => {
        if (e.target.name === "avatar") setAvatarFailed(false);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        const { newPassword, ...fields } = form;
        if (newPassword && newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }
        setSaving(true);
        try {
            const payload = newPassword ? { ...fields, password: newPassword } : fields;
            const { data } = await api.patch(`/users/${user.id}`, payload);
            const { password: _password, ...safeUser } = data;
            setLogin({ status: true, user: safeUser });
            setForm({ ...form, newPassword: "" });
            toast("Profile updated");
        } catch (err) {
            console.error(err);
            setError("Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    const initial = (form.name || "?").charAt(0).toUpperCase();
    const showImage = form.avatar && !avatarFailed;
    const isStaff = ["admin", "employee"].includes(user.role);

    return (
        <section className="sf-section">
            <div className="sf-container">
                <div className="sf-profile">
                    <div className="sf-panel sf-profile-card">
                        {showImage ? (
                            <img src={form.avatar} alt="Avatar" onError={() => setAvatarFailed(true)} />
                        ) : (
                            <div className="sf-bigavatar">{initial}</div>
                        )}
                        <h2>{form.name || "Your name"}</h2>
                        <p className="sf-muted">{user.email}</p>
                        <span className="sf-pill">{isStaff ? "Staff" : "Customer"}</span>
                        <div className="sf-profile-links">
                            {!isStaff && <Link to="/orders"><i className="bi bi-box-seam"></i>My orders</Link>}
                            <Link to="/wishlist"><i className="bi bi-heart"></i>Wishlist</Link>
                            {isStaff && <Link to="/dashboard"><i className="bi bi-speedometer2"></i>Dashboard</Link>}
                        </div>
                    </div>

                    <form onSubmit={submit} className="sf-panel">
                        <h2>My profile</h2>
                        <p className="sf-muted">Update your details. Checkout uses them to fill in delivery information.</p>

                        <label className="sf-field">
                            <span>Name</span>
                            <input name="name" value={form.name} onChange={change} className="sf-input" required />
                        </label>
                        <label className="sf-field">
                            <span>Phone</span>
                            <input name="phone" value={form.phone} onChange={change} className="sf-input" type="tel" />
                        </label>
                        <label className="sf-field">
                            <span>Address</span>
                            <textarea name="address" value={form.address} onChange={change} rows="3" className="sf-input"></textarea>
                        </label>
                        <label className="sf-field">
                            <span>Profile picture URL</span>
                            <input type="url" name="avatar" value={form.avatar} onChange={change} className="sf-input" placeholder="https://..." />
                        </label>
                        <label className="sf-field">
                            <span>New password (leave blank to keep current)</span>
                            <div className="sf-pass">
                                <input type={showPassword ? "text" : "password"} name="newPassword" value={form.newPassword} onChange={change} className="sf-input" autoComplete="new-password" />
                                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </label>

                        {error && <div className="sf-alert danger" role="alert">{error}</div>}
                        <button type="submit" className="sf-btn" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Profile;
