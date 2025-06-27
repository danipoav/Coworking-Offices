import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { Empresa } from '../interfaces/Empresa'
import { Modalidad } from "../enums/Modalidad"
import { Logo } from "../enums/Logo"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/button/button"
import { PopupText } from "../components/popupText/popupText"
import * as styles from '../common/styles/formStyles'
import * as color from '../common/styles/colors'
import { db } from "../firebaseConfig"
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore"
import { useAuth } from "../common/AuthContext"
import { toast } from 'react-toastify'

export const FormSuscribe = () => {

    const navigate = useNavigate()
    const empresaSeleccionada = useSelector((state: RootState) => state.empresas.empresaSeleccionada)
    const { user } = useAuth()
    const [showPopup, setShowPopup] = useState(false)
    const [company, setCompany] = useState<Empresa>({
        id: '',
        razon_social: '',
        email: [],
        fecha_inicio: '',
        fecha_renovacion: '',
        modalidad: Modalidad.trimestral,
        myBusiness: false,
        pendiente_pago: false,
        renovacion: false,
        contacto: '',
        telefono_contacto: [],
        titular: '',
        telefono_titular: '',
        comentarios: '',
        logo: ''
    })
    const [originalCompany, setOriginalCompany] = useState<Empresa | null>(null)
    const [telefono, setTelefono] = useState('')
    const [email, setEmail] = useState('')
    const nombresMeses = [
        'enero', 'febrero', 'marzo', 'abril',
        'mayo', 'junio', 'julio', 'agosto',
        'septiembre', 'octubre', 'noviembre', 'diciembre',
    ]

    useEffect(() => {
        if (empresaSeleccionada) {
            setCompany(empresaSeleccionada)
            setOriginalCompany(empresaSeleccionada)
        }
    }, [empresaSeleccionada])
    useEffect(() => {
        if (!company.fecha_inicio) return

        const [dd, mm, yyyy] = company.fecha_inicio.split('-')
        const ym = `${yyyy}-${mm}`

        const addedMonths =
            company.modalidad === Modalidad.trimestral ? 2 :
                company.modalidad === Modalidad.semestral ? 5 :
                    11

        const renewalYm = addMonthsToYYYYMM(ym, addedMonths)
        const fechaRenovacionCompleta = getLastDayOfMonth(renewalYm)

        setCompany(prev => ({
            ...prev,
            fecha_renovacion: fechaRenovacionCompleta
        }))
    }, [company.fecha_inicio, company.modalidad])

    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const handleAddTelefono = () => {
        if (telefono.trim()) {
            setCompany(prev => ({
                ...prev,
                telefono_contacto: [...prev.telefono_contacto, telefono.trim()]
            }))
            setTelefono('')
        }
    }
    const handleAddEmail = () => {
        if (email.trim()) {
            setCompany(prev => ({
                ...prev,
                email: [...prev.email, email.trim()]
            }))
            setEmail('')
        }
    }
    const handleRemoveTelefono = (index: number) => {
        setCompany(prev => ({
            ...prev,
            telefono_contacto: prev.telefono_contacto.filter((_, i) => i !== index)
        }))
    }
    const handleRemoveEmail = (index: number) => {
        setCompany(prev => ({
            ...prev,
            email: prev.email.filter((_, i) => i !== index)
        }))
    }

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCompany(prev => ({ ...prev, [name]: value }))
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setCompany(prev => ({ ...prev, [name]: value }))
    }
    const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ym = e.target.value
        const fechaInicioCompleta = `01-${ym.split('-')[1]}-${ym.split('-')[0]}`
        setCompany(prev => ({ ...prev, fecha_inicio: fechaInicioCompleta }))
    }
    const handleModalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modalidad = e.target.value as Modalidad
        const isMyBusiness = modalidad === Modalidad.myBusiness
        setCompany(prev => ({ ...prev, modalidad, myBusiness: isMyBusiness }))
    }
    const handleLogoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const logo = e.target.value as Logo
        setCompany(prev => ({ ...prev, logo: logo }))
    }
    const handlePopupCancel = () => {
        setCompany(prev => ({ ...prev, renovacion: true }))
        setShowPopup(false)
    }
    const handlePopupSave = async (text: string) => {
        if (!originalCompany) return

        const cambios = {
            "Motivo Baja": {
                antes: "",
                despues: text
            }
        }

        try {
            await saveHistoricalChanges(originalCompany.id, cambios)
            toast.success("Motivo de baja guardado en el historial.")
        } catch (error) {
            toast.error("Error guardando motivo de baja.")
            console.error(error)
        }
        setShowPopup(false)
    }
    const addMonthsToYYYYMM = (yyyymm: string, monthsToAdd: number): string => {
        const [yearStr, monthStr] = yyyymm.split('-')
        let year = Number(yearStr)
        let month = Number(monthStr)

        month += monthsToAdd
        year += Math.floor((month - 1) / 12)
        month = ((month - 1) % 12) + 1

        return `${year}-${String(month).padStart(2, '0')}`
    }
    const getLastDayOfMonth = (yyyyMm: string): string => {
        const [yearStr, monthStr] = yyyyMm.split('-')
        const lastDayDate = new Date(Number(yearStr), Number(monthStr), 0)
        const dd = String(lastDayDate.getDate()).padStart(2, '0')
        return `${dd}-${monthStr}-${yearStr}`
    }

    const saveHistoricalChanges = async (companyId: string, cambios: Record<string, any>) => {
        try {
            const historicoRef = doc(db, "HistoricoList", companyId)
            const historicoSnap = await getDoc(historicoRef)

            const fecha = new Date()
            const entradaHistorial = {
                fecha: fecha.toISOString(),
                usuario: user?.email || "desconocido",
                cambios: cambios,
            }

            if (historicoSnap.exists()) {
                // Ya existe, actualizamos agregando al historial
                await updateDoc(historicoRef, {
                    historial: arrayUnion(entradaHistorial)
                })
            } else {
                // No existe, lo creamos
                await setDoc(historicoRef, {
                    empresaId: companyId,
                    historial: [entradaHistorial]
                })
            }

            console.log("Historial actualizado correctamente.")
        } catch (error) {
            console.error("Error guardando en historial:", error)
        }


    }
    const handleDarDeAltaEmpresa = () => {
        const confirmado = window.confirm("¿Estás seguro de que quieres dar de baja la empresa?")
        if (confirmado) {
            darDeAltaEmpresa()
        }
    }
    const darDeAltaEmpresa = async () => {
        if (!company.id) {
            toast.error("Empresa no válida o sin ID.")
            return
        }

        try {
            const empresaRef = doc(db, "EmpresaList", company.id)
            const empresaSnap = await getDoc(empresaRef)

            if (!empresaSnap.exists()) {
                toast.error("No se encontró la empresa en la base de datos.")
                return
            }

            const datosEmpresa = empresaSnap.data()

            const bajaRef = doc(db, "BajasList", company.id)
            await setDoc(bajaRef, {
                ...datosEmpresa,
                fecha_baja: new Date().toISOString()
            })

            await deleteDoc(empresaRef)

            toast.success("Empresa dada de baja correctamente.")
        } catch (error) {
            console.error("Error al dar de baja la empresa:", error)
            toast.error("Error al dar de baja la empresa.")
        }
    }

    return (<>

        {console.log(company)}

        <styles.GlobalDateTimeStyles />
        {showPopup && (
            <PopupText onCancel={handlePopupCancel} onSave={handlePopupSave} />
        )}

        <styles.Container justifycontent="center">
            <styles.Column>
                <styles.EntryVertical gap="3rem">
                    <styles.BackButtonStyled onClick={() => navigate("/home")}>
                        <FaArrowLeft />
                        Inicio
                    </styles.BackButtonStyled>
                    <styles.CompanyName>
                        {company?.razon_social || ''}
                    </styles.CompanyName>
                    {/* PONER BOTON O SIMILAR PARA SABER "ACTIVA, INACTIVA O PENDIENTE DE PAGO" */}
                </styles.EntryVertical>

                <styles.EntryVertical>
                    <styles.Title>Razón Social*</styles.Title>
                    <styles.InputText
                        name='razon_social'
                        value={company?.razon_social || ''}
                        type='text'
                        placeholder='Ejm: Farogems Jewls OU'
                        onChange={handleStringChange}>
                    </styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Nombre de la persona de contacto*</styles.Title>
                    <styles.InputText
                        name='contacto'
                        value={company?.contacto || ''}
                        type='text'
                        placeholder='Ejm: Juan Pérez Solís'
                        onChange={handleStringChange}>
                    </styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>E-mail*</styles.Title>
                    <styles.EntryHorizontal>
                        <styles.InputText
                            type='text'
                            placeholder='Ejm: correo@correo.com'
                            name='email'
                            value={email}
                            onChange={handleEmailChange}
                        ></styles.InputText>
                        <styles.ButtonAddDelete
                            margin="0 0 0 0.5rem"
                            color={color.green}
                            onClick={handleAddEmail}>
                            +
                        </styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {Array.isArray(company.email) && company.email.length > 0 && (
                        <styles.ArrayBox>
                            {company.email.map((email, index) => (
                                <styles.ArrayItem key={index}>
                                    {email}
                                    <styles.ButtonAddDelete
                                        margin="0 0 0 0.35rem"
                                        color={color.red}
                                        onClick={() => handleRemoveEmail(index)}>
                                        &times;
                                    </styles.ButtonAddDelete>
                                </styles.ArrayItem>
                            ))}
                        </styles.ArrayBox>
                    )}
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Teléfonos*</styles.Title>
                    <styles.EntryHorizontal>
                        <styles.InputText
                            type='text'
                            placeholder='Ejm: 612345678'
                            width='13.5rem'
                            name='telefono_contacto'
                            value={telefono}
                            onChange={handleTelefonoChange}
                        ></styles.InputText>
                        <styles.ButtonAddDelete
                            margin="0 0 0 0.5rem"
                            color={color.green}
                            onClick={handleAddTelefono}>
                            +
                        </styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {Array.isArray(company.telefono_contacto) && company.telefono_contacto.length > 0 && (
                        <styles.ArrayBox>
                            {company.telefono_contacto.map((telefono, index) => (
                                <styles.ArrayItem key={index}>
                                    {telefono}
                                    <styles.ButtonAddDelete
                                        margin="0 0 0 0.35rem"
                                        color={color.red}
                                        onClick={() => handleRemoveTelefono(index)}>
                                        &times;
                                    </styles.ButtonAddDelete>
                                </styles.ArrayItem>
                            ))}
                        </styles.ArrayBox>
                    )}
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Fecha de inicio de contratación*</styles.Title>
                    <styles.InputText
                        name="fecha_inicio"
                        type="month"
                        width="13.5rem"
                        value={
                            company.fecha_inicio
                                ? company.fecha_inicio.slice(6, 10) + '-' + company.fecha_inicio.slice(3, 5)
                                : ''
                        }
                        onChange={handleFechaInicioChange}
                    />
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Modalidad contratada*</styles.Title>
                    <styles.Select
                        name="modalidad"
                        value={company?.modalidad || ''}
                        width='11.5rem'
                        onChange={handleModalidadChange}>
                        <option>{Modalidad.trimestral}</option>
                        <option>{Modalidad.semestral}</option>
                        <option>{Modalidad.anual}</option>
                        <option>{Modalidad.myBusiness}</option>
                    </styles.Select>
                </styles.EntryVertical>
            </styles.Column>

            <styles.Column padding="9em 1em 1em">
                <styles.EntryVertical>
                    <styles.Title>Nombre del titular*</styles.Title>
                    <styles.InputText
                        name="titular"
                        value={company?.titular || ''}
                        type='text'
                        placeholder='Ejm: Juan Pérez Solís'
                        onChange={handleStringChange}>
                    </styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Teléfono del titular*</styles.Title>
                    <styles.InputText
                        name="telefono_titular"
                        value={company?.telefono_titular || ''}
                        type='text'
                        placeholder='Ejm: 612345678'
                        width='13.5rem'
                        onChange={handleStringChange}></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Logo*</styles.Title>
                    <styles.Select
                        name="logo"
                        value={company?.logo || ''}
                        width='11.5rem'
                        onChange={handleLogoChange}>
                        <option>{Logo.si}</option>
                        <option>{Logo.no}</option>
                        <option>{Logo.directorio}</option>
                    </styles.Select>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Fecha de la siguiente renovación*</styles.Title>
                    <styles.InputText
                        name="fecha_renovacion"
                        type="text"
                        width="13.5rem"
                        readOnly
                        value={
                            company.fecha_renovacion &&
                                company.fecha_renovacion.match(/^\d{2}-\d{2}-\d{4}$/) // Validar formato DD-MM-YYYY
                                ? (() => {
                                    const [dd, mm, yyyy] = company.fecha_renovacion.split('-')
                                    const nombreMes = nombresMeses[Number(mm) - 1]
                                    return `${nombreMes} de ${yyyy}`
                                })()
                                : 'Introducir fecha de inicio'
                        }
                    />
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Comentarios</styles.Title>
                    <styles.TextArea
                        name="comentarios"
                        width='20rem'
                        onChange={handleTextAreaChange}>
                    </styles.TextArea>
                </styles.EntryVertical>
                <styles.EntryHorizontal>
                    <Button
                        color={color.blue}
                        width="11rem"
                        padding="0.5em 0"
                        onClick={handleDarDeAltaEmpresa}>
                        <styles.IconAddUser />
                        Dar de Alta
                    </Button>
                </styles.EntryHorizontal>
            </styles.Column>
        </styles.Container>

    </>)
}
