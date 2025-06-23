import { Navigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";
import type { JSX } from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    if (loading) return <p className="text-center mt-8">Cargando...</p>;

    return user ? children : <Navigate to="/login" />;
};