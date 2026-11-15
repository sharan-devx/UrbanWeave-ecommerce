import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoginContext } from "./Context/LoginContext";
import { canAccess, isStaff } from "../Permissions";

export default function RequireAuth({ children, staff = false, page }) {
    const { login } = useContext(LoginContext);
    const location = useLocation();

    if (!login.status) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    if ((staff || page) && !isStaff(login.user)) {
        return <Navigate to="/profile" replace />;
    }
    if (page && !canAccess(login.user, page)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}
