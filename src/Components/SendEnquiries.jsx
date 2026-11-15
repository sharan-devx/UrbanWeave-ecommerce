import React, { useState } from "react";
import api from "../api";
import { useStoreToast } from "./Store/storeToast";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };
const NAME_PATTERN = /^[a-zA-Z\s]+$/;
const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const validate = ({ name, email, subject, message }) => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is mandatory";
    else if (!NAME_PATTERN.test(name)) errors.name = "Name should contain letters only";

    if (!email.trim()) errors.email = "Email is mandatory";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Invalid email address";

    if (!subject.trim()) errors.subject = "Please add a subject";
    if (!message.trim()) errors.message = "Please write a message";
    return errors;
};

const Field = ({ label, error, children }) => (
    <label className="sf-field">
        <span>{label}</span>
        {children}
        {error && <span className="sf-error">{error}</span>}
    </label>
);

export default function SendEnquiries() {
    const toast = useStoreToast();
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);

    const changeData = (e) => {
        const { name, value } = e.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setSending(true);
        try {
            await api.post("/enquires", form);
            setForm(EMPTY_FORM);
            toast("Thank you! Your message has been sent.");
        } catch (err) {
            console.error(err);
            toast("Could not send your message. Please try again.", "danger");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={submitHandler} noValidate>
            <div className="sf-two">
                <Field label="Your name" error={errors.name}>
                    <input type="text" name="name" value={form.name} onChange={changeData} className="sf-input" autoComplete="name" />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input type="email" name="email" value={form.email} onChange={changeData} className="sf-input" autoComplete="email" />
                </Field>
            </div>
            <Field label="Subject" error={errors.subject}>
                <input type="text" name="subject" value={form.subject} onChange={changeData} className="sf-input" />
            </Field>
            <Field label="Message" error={errors.message}>
                <textarea rows="6" name="message" value={form.message} onChange={changeData} className="sf-input" placeholder="Tell us how we can help"></textarea>
            </Field>
            <button className="sf-btn" type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send message"}
            </button>
        </form>
    );
}
