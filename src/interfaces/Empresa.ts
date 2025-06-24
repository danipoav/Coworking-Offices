import { Modalidad } from "../enums/Modalidad"

export interface Empresa {
    id: string
    razon_social: string
    email: string[]
    fecha_inicio: string
    fecha_renovacion: string
    modalidad: Modalidad
    myBusiness: boolean
    pendiente_pago: boolean
    renovacion: boolean
    contacto: string
    telefono_contacto: string[]
    titular: string
    telefono_titular: string
    comentarios: string
    logo: string
}