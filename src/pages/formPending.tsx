import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { Empresa } from '../interfaces/Empresa'
import { Modalidad } from "../enums/Modalidad"
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


export const FormPending = () => {

    const navigate = useNavigate()
    const empresaSeleccionada = useSelector((state: RootState) => state.empresas.empresaSeleccionada)
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
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
        const trimmedPhone = telefono.trim()
        if (!isValidPhone(trimmedPhone)) {
            toast.error("Introduce un teléfono válido con al menos 9 dígitos (solo números, espacios y '+').")
            return
        }

        setCompany(prev => ({
            ...prev,
            telefono_contacto: [...prev.telefono_contacto, trimmedPhone]
        }))
        setTelefono('')
    }

    const handleAddEmail = () => {
        const trimmedEmail = email.trim()
        if (!isValidEmail(trimmedEmail)) {
            toast.error("Introduce un correo electrónico válido.")
            return
        }

        setCompany(prev => ({
            ...prev,
            email: [...prev.email, trimmedEmail]
        }))
        setEmail('')
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
    const handleCheckboxChange = () => {
        if (company.renovacion) {
            setCompany(prev => ({ ...prev, renovacion: false }))
            setShowPopup(true)
        } else {
            setCompany(prev => ({ ...prev, renovacion: true }))
            setShowPopup(false)
        }
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
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }
    const isValidPhone = (telefono: string): boolean => {
        const digitsOnly = telefono.replace(/[^\d]/g, '')
        const phoneRegex = /^[\d +]+$/
        return phoneRegex.test(telefono) && digitsOnly.length >= 9
    }

    const handleEditToggle = () => {
        setOriginalCompany(company)
        setIsEditing(true)
    }
    const handleSave = async () => {
        if (!originalCompany) return

        const cambios = Object.entries(company).reduce((acc, [key, value]) => {
            if (JSON.stringify(value) !== JSON.stringify((originalCompany as any)[key])) {
                acc[key] = {
                    antes: (originalCompany as any)[key],
                    despues: value
                }
            }
            return acc
        }, {} as Record<string, any>)

        if (Object.keys(cambios).length > 0) {
            saveHistoricalChanges(originalCompany.id, cambios)
            await updateCompany(originalCompany.id, cambios)
        }

        setIsEditing(false)
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
            toast.success('cambios guardados con exito')
        } catch (error) {
            toast.error(`Error guardando en historial: ${error}`)
        }


    }
    const updateCompany = async (companyId: string, cambios: Record<string, any>) => {
        try {
            const companyRef = doc(db, "EmpresaList", companyId)
            const updatedFields = Object.fromEntries(
                Object.entries(cambios).map(([key, change]) => [key, change.despues])
            )

            await updateDoc(companyRef, updatedFields)
        } catch (error) {
            toast.error(`Error actualizando empresa: ${error}`)
        }
    }
    const downloadHistoric = async (companyId: string) => {
        const historicoRef = doc(db, 'HistoricoList', companyId)
        const snapshot = await getDoc(historicoRef)

        if (!snapshot.exists()) {
            toast.error('No se encontraron cambios históricos para esta empresa.')
            return
        }

        const data = snapshot.data()
        const eventos = data.historial || []

        if (eventos.length === 0) {
            toast.info('El historial está vacío.')
            return
        }

        // Construir el contenido del archivo
        let content = 'Fecha y hora\tUsuario\tCampo\tAntes\tDespués\n'

        eventos.forEach((evento: any) => {
            const date = new Date(evento.fecha).toLocaleString()
            const user = evento.usuario

            const cambios = evento.cambios as Record<string, { antes: any, despues: any }>
            Object.entries(cambios).forEach(([campo, { antes, despues }]) => {
                content += `${date}\t${user}\t${campo}\t${JSON.stringify(antes)}\t${JSON.stringify(despues)}\n`
            })
        })

        // Crear y descargar archivo .txt
        const blob = new Blob([content], { type: 'text/plaincharset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `historial_${companyId}.txt`
        a.click()
        URL.revokeObjectURL(url)

        toast.success('Historial descargado correctamente.')
    }

    const handleProcesarPago = () => {
        const confirmado = window.confirm("¿Estás seguro de que quieres procesar el pago?")
        if (confirmado) {
            procesarPago()
        }
    }
    const procesarPago = async () => {
        if (!originalCompany) return

        // Paso 1: calcular nueva fecha de inicio = día siguiente a la fecha_renovacion actual
        const [dia, mes, anio] = company.fecha_renovacion.split('-').map(Number)
        const fechaRenovacionActual = new Date(anio, mes - 1, dia)
        const nuevaFechaInicioDate = new Date(fechaRenovacionActual)
        nuevaFechaInicioDate.setDate(nuevaFechaInicioDate.getDate() + 1)

        const nuevaFechaInicio = `${String(nuevaFechaInicioDate.getDate()).padStart(2, '0')}-${String(nuevaFechaInicioDate.getMonth() + 1).padStart(2, '0')}-${nuevaFechaInicioDate.getFullYear()}`

        // Paso 2: determinar meses a sumar según modalidad
        let mesesASumar: number

        switch (company.modalidad) {
            case Modalidad.trimestral:
                mesesASumar = 2
                break
            case Modalidad.semestral:
                mesesASumar = 5
                break
            case Modalidad.anual:
            case Modalidad.myBusiness:
                mesesASumar = 11
                break
            default:
                throw new Error(`Modalidad no reconocida: ${company.modalidad}`)
        }

        const fechaRenovacionFinalDate = new Date(nuevaFechaInicioDate.getFullYear(), nuevaFechaInicioDate.getMonth() + mesesASumar + 1, 0) // último día del mes resultante
        const nuevaFechaRenovacion = `${String(fechaRenovacionFinalDate.getDate()).padStart(2, '0')}-${String(fechaRenovacionFinalDate.getMonth() + 1).padStart(2, '0')}-${fechaRenovacionFinalDate.getFullYear()}`

        // Paso 3: actualizar campos en el estado local
        const empresaActualizada: Empresa = {
            ...company,
            fecha_inicio: nuevaFechaInicio,
            fecha_renovacion: nuevaFechaRenovacion
        }

        // Paso 4: detectar cambios con respecto al original
        const cambios = Object.entries(empresaActualizada).reduce((acc, [key, value]) => {
            if (JSON.stringify(value) !== JSON.stringify((originalCompany as any)[key])) {
                acc[key] = {
                    antes: (originalCompany as any)[key],
                    despues: value
                }
            }
            return acc
        }, {} as Record<string, { antes: any; despues: any }>)

        if (Object.keys(cambios).length > 0) {
            await saveHistoricalChanges(originalCompany.id, cambios)
            await updateCompany(originalCompany.id, cambios)
            setCompany(empresaActualizada)
            setOriginalCompany(empresaActualizada)
            toast.success("Pago procesado y fechas actualizadas con éxito.")
        } else {
            toast.info("No se detectaron cambios al procesar el pago.")
        }
    }
    const handleDarDeBajaEmpresa = () => {
        const confirmado = window.confirm("¿Estás seguro de que quieres dar de baja la empresa?")
        if (confirmado) {
            company.renovacion = false
            const cambios = Object.entries(company).reduce((acc, [key, value]) => {
                if (JSON.stringify(value) !== JSON.stringify((originalCompany as any)[key])) {
                    acc[key] = {
                        antes: (originalCompany as any)[key],
                        despues: value
                    }
                }
                return acc
            }, {} as Record<string, any>)
            updateCompany(company.id, cambios)
            darDeBajaEmpresa()
        }
    }
    const darDeBajaEmpresa = async () => {
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
            toast.error("Error al dar de baja la empresa.")
        }
    }

    return (<>

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
                </styles.EntryVertical>

                <styles.EntryVertical>
                    <styles.Title>Razón Social*</styles.Title>
                    <styles.InputText
                        name='razon_social'
                        value={company?.razon_social || ''}
                        type='text'
                        placeholder='Ejm: Farogems Jewls OU'
                        disabled={!isEditing}
                        editable={isEditing}
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
                        disabled={!isEditing}
                        editable={isEditing}
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
                            disabled={!isEditing}
                            editable={isEditing}
                            onChange={handleEmailChange}
                        ></styles.InputText>
                        <styles.ButtonAddDelete
                            margin="0 0 0 0.5rem"
                            color={color.green}
                            disabled={!isEditing}
                            editable={isEditing}
                            onClick={handleAddEmail}>
                            +
                        </styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {Array.isArray(company.email) && company.email.length > 0 && (
                        <styles.ArrayBox editable={isEditing}>
                            {company.email.map((email, index) => (
                                <styles.ArrayItem key={index}>
                                    {email}
                                    <styles.ButtonAddDelete
                                        margin="0 0 0 0.35rem"
                                        color={color.red}
                                        disabled={!isEditing}
                                        editable={isEditing}
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
                            disabled={!isEditing}
                            editable={isEditing}
                            onChange={handleTelefonoChange}
                        ></styles.InputText>
                        <styles.ButtonAddDelete
                            margin="0 0 0 0.5rem"
                            color={color.green}
                            disabled={!isEditing}
                            editable={isEditing}
                            onClick={handleAddTelefono}>
                            +
                        </styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {Array.isArray(company.telefono_contacto) && company.telefono_contacto.length > 0 && (
                        <styles.ArrayBox editable={isEditing}>
                            {company.telefono_contacto.map((telefono, index) => (
                                <styles.ArrayItem key={index}>
                                    {telefono}
                                    <styles.ButtonAddDelete
                                        margin="0 0 0 0.35rem"
                                        color={color.red}
                                        disabled={!isEditing}
                                        editable={isEditing}
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
                        disabled={!isEditing}
                        editable={isEditing}
                        onChange={handleFechaInicioChange}
                    />
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Modalidad contratada*</styles.Title>
                    <styles.Select
                        name="modalidad"
                        value={company?.modalidad || ''}
                        width='11.5rem'
                        disabled={!isEditing}
                        editable={isEditing}
                        onChange={handleModalidadChange}>
                        <option>{Modalidad.trimestral}</option>
                        <option>{Modalidad.semestral}</option>
                        <option>{Modalidad.anual}</option>
                        <option>{Modalidad.myBusiness}</option>
                    </styles.Select>
                </styles.EntryVertical>
            </styles.Column>

            <styles.Column padding="11.5em 1em 1em">
                <styles.EntryVertical>
                    <styles.Title>Nombre del titular*</styles.Title>
                    <styles.InputText
                        name="titular"
                        value={company?.titular || ''}
                        type='text'
                        placeholder='Ejm: Juan Pérez Solís'
                        disabled={!isEditing}
                        editable={isEditing}
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
                        disabled={!isEditing}
                        editable={isEditing}
                        onChange={handleStringChange}></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Fecha de la siguiente renovación*</styles.Title>
                    <styles.InputText
                        name="fecha_renovacion"
                        type="text"
                        width="13.5rem"
                        disabled={!isEditing}
                        editable={isEditing}
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
                        disabled={!isEditing}
                        editable={isEditing}
                        onChange={handleTextAreaChange}>
                    </styles.TextArea>
                </styles.EntryVertical>
                <styles.EntryHorizontal>
                    {!isEditing ? (
                        <Button
                            color={color.blue}
                            width="11rem"
                            padding="0.5em 0"
                            onClick={handleEditToggle}
                        >
                            <styles.IconModifyUser />
                            Modificar
                        </Button>
                    ) : (
                        <Button
                            color={color.green}
                            width="11rem"
                            padding="0.5em 0"
                            onClick={handleSave}
                        >
                            <styles.IconSave />
                            Guardar
                        </Button>
                    )}
                    <Button
                        color={color.red}
                        margin='0 0 0 1.5rem'
                        width="11rem"
                        padding="0.5em 0"
                        onClick={handleDarDeBajaEmpresa}>
                        <styles.IconRemoveuser />
                        Dar de baja
                    </Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <Button
                        color={color.blue}
                        width="11rem"
                        padding="0.5em 0"
                        onClick={handleProcesarPago}>
                        <styles.IconProcessPay />
                        Procesar pago
                    </Button>
                    <Button
                        color={color.green}
                        margin='0 0 0 1.5rem'
                        width="11rem"
                        padding="0.5em 0"
                        onClick={() => downloadHistoric(company.id)} >
                        <styles.IconHistorical />
                        Historial
                    </Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <styles.CheckBox
                        type="checkbox"
                        checked={!company.renovacion}
                        disabled={!isEditing}
                        onChange={handleCheckboxChange}
                    />
                    <styles.Title>No renovar al finalizar el contrato</styles.Title>
                </styles.EntryHorizontal>
            </styles.Column>
        </styles.Container>

    </>)
}
