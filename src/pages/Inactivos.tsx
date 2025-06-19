import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmpresasInactivas } from "../store/empresasSlice";

export default function Inactivos() {
    const dispatch = useAppDispatch();
    const { inactivas, loading, error } = useAppSelector((state) => state.empresas)

    useEffect(() => {
        dispatch(fetchEmpresasInactivas());
    }, [dispatch])

    if (loading) return <p>Cargando empresas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {inactivas.map((empresa) => (
                <div key={empresa.id}>{empresa.razon_social}</div>
            ))}
        </div>
    )
}
