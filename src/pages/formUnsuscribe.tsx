
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


export const FormUnsuscribe = () => {

    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const empresaSeleccionada = useSelector((state: RootState) => state.empresas.empresaSeleccionada)
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
    const [telefono, setTelefono] = useState('')
    const [email, setEmail] = useState('')
    const nombresMeses = [
        'enero', 'febrero', 'marzo', 'abril',
        'mayo', 'junio', 'julio', 'agosto',
        'septiembre', 'octubre', 'noviembre', 'diciembre',
    ]
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        setCompany({
            id: empresaSeleccionada?.id || '',
            razon_social: empresaSeleccionada?.razon_social || '',
            email: Array.isArray(empresaSeleccionada?.email)
                ? empresaSeleccionada.email
                : [],
            fecha_inicio: empresaSeleccionada?.fecha_inicio || '',
            fecha_renovacion: empresaSeleccionada?.fecha_renovacion || '',
            modalidad: empresaSeleccionada?.modalidad || Modalidad.trimestral,
            myBusiness: empresaSeleccionada?.myBusiness || false,
            pendiente_pago: empresaSeleccionada?.pendiente_pago || false,
            renovacion: empresaSeleccionada?.renovacion || false,
            contacto: empresaSeleccionada?.contacto || '',
            telefono_contacto: Array.isArray(empresaSeleccionada?.telefono_contacto)
                ? empresaSeleccionada.telefono_contacto
                : [],
            titular: empresaSeleccionada?.titular || '',
            telefono_titular: empresaSeleccionada?.telefono_titular || '',
            comentarios: empresaSeleccionada?.comentarios || '',
            logo: empresaSeleccionada?.logo || '',
        })
    }, [empresaSeleccionada])
    useEffect(() => {
        if (!company.fecha_inicio) return

        // extraemos "YYYY-MM" de fecha_inicio "DD-MM-YYYY"
        const [dd, mm, yyyy] = company.fecha_inicio.split('-')
        const ym = `${yyyy}-${mm}`

        const addedMonths =
            company.modalidad === Modalidad.trimestral ? 2 :
                company.modalidad === Modalidad.semestral ? 5 :
                    11 // anual o myBusiness

        // sumamos meses → "YYYY-MM"
        const renewalYm = addMonthsToYYYYMM(ym, addedMonths)
        // obtenemos último día → "DD-MM-YYYY"
        const fechaRenovacionCompleta = getLastDayOfMonth(renewalYm)

        setCompany(prev => ({
            ...prev,
            fecha_renovacion: fechaRenovacionCompleta
        }))

    }, [company.fecha_inicio, company.modalidad])

    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTelefono(e.target.value)
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
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
        setCompany((prev) => ({
            ...prev,
            telefono_contacto: prev.telefono_contacto.filter(
                (_, i) => i !== index
            ),
        }))
    }
    const handleRemoveEmail = (index: number) => {
        setCompany((prev) => ({
            ...prev,
            email: prev.email.filter(
                (_, i) => i !== index
            ),
        }))
    }

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCompany({
            ...company,
            [name]: value
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setCompany({
            ...company,
            [name]: value
        })
    }
    const addMonthsToYYYYMM = (yyyymm: string, monthsToAdd: number): string => {
        const [yearStr, monthStr] = yyyymm.split('-')
        let year = Number(yearStr)
        let month = Number(monthStr)

        month += monthsToAdd
        year += Math.floor((month - 1) / 12)
        month = ((month - 1) % 12) + 1

        const mm = String(month).padStart(2, '0')
        return `${year}-${mm}`
    }
    const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ym = e.target.value            // "YYYY-MM"
        const fechaInicioCompleta = `01-${ym.split('-')[1]}-${ym.split('-')[0]}`
        setCompany(prev => ({
            ...prev,
            fecha_inicio: fechaInicioCompleta
        }))
    }
    const getLastDayOfMonth = (yyyyMm: string): string => {
        const [yearStr, monthStr] = yyyyMm.split('-')
        const year = Number(yearStr)
        const month = Number(monthStr)

        const lastDayDate = new Date(year, month, 0)
        const dd = String(lastDayDate.getDate()).padStart(2, '0')
        return `${dd}-${monthStr}-${yearStr}` // "DD-MM-YYYY"
    }

    const handleModalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modalidad = e.target.value as Modalidad
        const isMyBusiness = modalidad === Modalidad.myBusiness
        setCompany(prev => ({
            ...prev,
            modalidad,
            myBusiness: isMyBusiness
        }))
    }
    const handleCheckboxChange = () => {
        if (company.renovacion) {
            setCompany((prev) => ({ ...prev, renovacion: false }))
            setShowPopup(true)
        } else {
            setCompany((prev) => ({ ...prev, renovacion: true }))
            setShowPopup(false)
        }
    }

    const handlePopupCancel = () => {
        console.log('cancel')
        setCompany((prev) => ({ ...prev, renovacion: true }))
        setShowPopup(false)
    }
    const handlePopupSave = (text: string) => {
        console.log('guardar texto: ', text)
        setShowPopup(false)
    }


    return (<>

        {console.log('-->', company)}
        {console.log('==> ', empresaSeleccionada)}

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
                    {company.email.length > 0 && (
                        <styles.ArrayBox
                            editable={isEditing}>
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
                    {company.telefono_contacto.length > 0 && (
                        <styles.ArrayBox
                            editable={isEditing}>
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
                    <Button
                        color={color.blue}
                        width="11rem"
                        padding="0.5em 0"
                        onClick={() => setIsEditing(!isEditing)}>
                        <styles.IconModifyUser />
                        Modificar
                    </Button>
                    <Button
                        color={color.red}
                        margin='0 0 0 1.5rem'
                        width="11rem"
                        padding="0.5em 0">
                        <styles.IconRemoveuser />
                        Dar de baja
                    </Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <Button
                        color={color.blue}
                        width="11rem"
                        padding="0.5em 0">
                        <styles.IconProcessPay />
                        Procesar pago
                    </Button>
                    <Button
                        color={color.green}
                        margin='0 0 0 1.5rem'
                        width="11rem"
                        padding="0.5em 0">
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
