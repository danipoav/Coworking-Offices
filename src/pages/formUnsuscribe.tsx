
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
        // Ajusta overflow de meses
        year += Math.floor((month - 1) / 12)
        month = ((month - 1) % 12) + 1

        // Formatea de nuevo a "YYYY-MM"
        const mm = String(month).padStart(2, '0')
        return `${year}-${mm}`
    }
    const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const start = e.target.value // "YYYY-MM"
        const addedMonths =
            company.modalidad === Modalidad.trimestral ? 2 :
                company.modalidad === Modalidad.semestral ? 5 :
                    11

        const renewal = addMonthsToYYYYMM(start, addedMonths)

        const fechaInicioCompleta = `01-${start.split('-')[1]}-${start.split('-')[0]}`
        const fechaRenovacionCompleta = getLastDayOfMonth(renewal)

        setCompany((prev) => ({
            ...prev,
            fecha_inicio: fechaInicioCompleta,
            fecha_renovacion: fechaRenovacionCompleta
        }))
    }
    const getLastDayOfMonth = (yyyyMm: string): string => {
        const [yearStr, monthStr] = yyyyMm.split('-')
        const year = Number(yearStr)
        const month = Number(monthStr)

        // Día 0 del mes siguiente → último día del mes actual
        const lastDayDate = new Date(year, month, 0)
        const dd = String(lastDayDate.getDate()).padStart(2, '0')
        return `${dd}-${monthStr}-${yearStr}` // formato DD-MM-YYYY
    }

    const handleModalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modalidad = e.target.value as Modalidad
        const fechaInicio = company.fecha_inicio

        // booleano que depende de la modalidad
        const isMyBusiness = modalidad === Modalidad.myBusiness

        if (!fechaInicio) {
            // si no hay fecha_inicio solo actualiza modalidad y myBusiness
            setCompany(prev => ({
                ...prev,
                modalidad,
                myBusiness: isMyBusiness
            }))
            return
        }

        const addedMonths =
            modalidad === Modalidad.trimestral ? 3 :
                modalidad === Modalidad.semestral ? 6 :
                    12

        const renewal = addMonthsToYYYYMM(fechaInicio, addedMonths)

        setCompany(prev => ({
            ...prev,
            modalidad,
            myBusiness: isMyBusiness,
            fecha_renovacion: renewal
        }))
    }

    const handlePopupCancel = () => {
        console.log('cancel')
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
                        onChange={handleStringChange}>
                    </styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Nombre de la persona de contacto*</styles.Title>
                    <styles.InputText
                        name='contacto'
                        value={company?.titular || ''}
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
                        <styles.ButtonAddDelete margin="0 0 0 0.5rem" color={color.green} onClick={handleAddEmail}>+</styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {company.email.length > 0 && (
                        <styles.ArrayBox>
                            {company.email.map((email, index) => (
                                <styles.ArrayItem key={index}>
                                    {email}
                                    <styles.ButtonAddDelete margin="0 0 0 0.35rem" color={color.red} onClick={() => handleRemoveEmail(index)}>
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
                        <styles.ButtonAddDelete margin="0 0 0 0.5rem" color={color.green} onClick={handleAddTelefono}>+</styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {company.telefono_contacto.length > 0 && (
                        <styles.ArrayBox>
                            {company.telefono_contacto.map((telefono, index) => (
                                <styles.ArrayItem key={index}>
                                    {telefono}
                                    <styles.ButtonAddDelete margin="0 0 0 0.35rem" color={color.red} onClick={() => handleRemoveTelefono(index)}>
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
                        value={company.fecha_inicio ? company.fecha_inicio.slice(6, 10) + '-' + company.fecha_inicio.slice(3, 5) : ''}
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

            <styles.Column padding="11.5em 1em 1em">
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
                    <styles.Title>Fecha de la siguiente renovación*</styles.Title>
                    <styles.InputText
                        name="fecha_renovacion"
                        type="text"
                        width="13.5rem"
                        value={company.fecha_renovacion
                            ? company.fecha_renovacion.slice(6, 10) + '-' + company.fecha_renovacion.slice(3, 5)
                            : ''}
                        readOnly
                    />
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Comentarios</styles.Title>
                    <styles.TextArea name="comentarios" width='20rem' onChange={handleTextAreaChange}></styles.TextArea>
                </styles.EntryVertical>
                <styles.EntryHorizontal>
                    <Button color={color.blue}>
                        <styles.IconModifyUser />
                        Modificar
                    </Button>
                    <Button color={color.red} margin='0 0 0 1.5rem'>
                        <styles.IconRemoveuser />
                        Dar de baja
                    </Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <Button color={color.blue}>
                        <styles.IconProcessPay />
                        Procesar pago
                    </Button>
                    <Button color={color.green} margin='0 0 0 1.5rem'>
                        <styles.IconHistorical />
                        Historial
                    </Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <styles.CheckBox name="renovacion" type='checkbox' checked={showPopup} onChange={() => setShowPopup(!showPopup)}></styles.CheckBox>
                    <styles.Title>No renovar al finalizar el contrato</styles.Title>
                </styles.EntryHorizontal>
            </styles.Column>
        </styles.Container>

    </>)
}
