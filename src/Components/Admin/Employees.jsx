import React, { useEffect, useState } from "react";
import api from "../../api";
import { POSITIONS } from "../../Permissions";
import { Avatar, EmptyState, PageHeader, TableSkeleton } from "./ui";
import { useToast } from "./toast";

const EMPTY = { name: "", email: "", password: "", position: "orders" };

const Employees = () => {
    const toast = useToast();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        api.get("/users", { params: { role: "employee" } })
            .then((res) => {
                if (cancelled) return;
                setEmployees(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const reload = () => setReloadKey((k) => k + 1);
    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const addEmployee = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            toast("Password must be at least 6 characters", "danger");
            return;
        }
        setSaving(true);
        try {
            const { data: existing } = await api.get("/users", { params: { email: form.email } });
            if (existing.length > 0) {
                toast("An account with this email already exists", "danger");
                return;
            }
            await api.post("/users", { ...form, role: "employee" });
            setForm(EMPTY);
            toast("Employee added");
            reload();
        } catch (err) {
            console.error(err);
            toast("Could not add the employee", "danger");
        } finally {
            setSaving(false);
        }
    };

    const changePosition = (emp, position) => {
        api.patch(`/users/${emp.id}`, { position })
            .then(() => {
                toast(`${emp.name} is now ${POSITIONS[position]}`);
                reload();
            })
            .catch((err) => {
                console.error(err);
                toast("Could not change the position", "danger");
            });
    };

    const removeEmployee = (emp) => {
        if (!window.confirm(`Remove ${emp.name}? Their account will be deleted.`)) return;
        api.delete(`/users/${emp.id}`)
            .then(() => {
                toast(`${emp.name} was removed`);
                reload();
            })
            .catch((err) => {
                console.error(err);
                toast("Could not remove the employee", "danger");
            });
    };

    return (
        <>
            <PageHeader title="Employees" subtitle={`${employees.length} team members`} />

            <div className="adm-card mb-4">
                <h3 className="adm-card-title mb-3">Add employee</h3>
                <form onSubmit={addEmployee} className="row g-2">
                    <div className="col-md-3"><input name="name" value={form.name} onChange={change} placeholder="Name" className="form-control" aria-label="Name" required /></div>
                    <div className="col-md-3"><input type="email" name="email" value={form.email} onChange={change} placeholder="Email" className="form-control" aria-label="Email" required /></div>
                    <div className="col-md-2"><input type="password" name="password" value={form.password} onChange={change} placeholder="Password" className="form-control" aria-label="Password" required /></div>
                    <div className="col-md-2">
                        <select name="position" value={form.position} onChange={change} className="form-select" aria-label="Position">
                            {Object.entries(POSITIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-success w-100" disabled={saving}>
                            {saving ? "Adding..." : <><i className="bi bi-plus-lg me-1"></i>Add</>}
                        </button>
                    </div>
                </form>
            </div>

            <div className="adm-card p-0">
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr><th>Employee</th><th>Position</th><th className="text-end">Action</th></tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={3} cols={3} />
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <Avatar name={emp.name} />
                                                <div>
                                                    <div className="fw-semibold">{emp.name}</div>
                                                    <div className="adm-sub">{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ minWidth: 200 }}>
                                            <select className="form-select form-select-sm w-auto" value={emp.position} onChange={(e) => changePosition(emp, e.target.value)} aria-label={`Position of ${emp.name}`}>
                                                {Object.entries(POSITIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                            </select>
                                        </td>
                                        <td className="text-end">
                                            <button type="button" className="adm-icon-btn danger" onClick={() => removeEmployee(emp)} title="Remove" aria-label={`Remove ${emp.name}`}>
                                                <i className="bi bi-person-dash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && employees.length === 0 && <EmptyState icon="bi-person-badge" title="No employees yet" text="Add your first team member above." />}
            </div>
        </>
    );
};

export default Employees;
