import type { Empresa } from "./Empresa"

export type TablaEmpresasProps = {
    datos: Empresa[]
    paginaActual: number
    setPaginaActual: (page: number) => void
    estado: 'activo' | 'inactivo' | 'pendiente'
    rutaDetalle?: string
}