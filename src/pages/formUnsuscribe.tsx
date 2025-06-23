
import { useState } from "react"
import type { Empresa } from '../interfaces/Empresa.ts'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import * as styles from '../common/styles/formStyles.ts'
import * as color from '../common/styles/colors.ts'


export const FormUnsuscribe = () => {

    const navigate = useNavigate()
    const [newCompany, setNewCompany] = useState<Empresa>({
        id: '',
        razon_social: '',
        email: [],
        fecha_inicio: '',
        fecha_renovacion: '',
        modalidad: '',
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

    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTelefono(e.target.value);
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleAddTelefono = () => {
        if (telefono.trim()) {
            setNewCompany(prev => ({
                ...prev,
                telefono_contacto: [...prev.telefono_contacto, telefono.trim()]
            }));
            setTelefono('')
        }
    }
    const handleAddEmail = () => {
        if (email.trim()) {
            setNewCompany(prev => ({
                ...prev,
                email: [...prev.email, email.trim()]
            }));
            setEmail('')
        }
    }

    const handleRemoveTelefono = (index: number) => {
        setNewCompany((prev) => ({
            ...prev,
            telefono_contacto: prev.telefono_contacto.filter(
                (_, i) => i !== index
            ),
        }))
    }
    const handleRemoveEmail = (index: number) => {
        setNewCompany((prev) => ({
            ...prev,
            email: prev.email.filter(
                (_, i) => i !== index
            ),
        }))
    }


    return (<>

        <styles.GlobalDateTimeStyles />

        <styles.Container>
            <styles.BackButtonStyled onClick={() => navigate("/home")}>
                <FaArrowLeft />
                Inicio
            </styles.BackButtonStyled>
        </styles.Container>

        <styles.Container margin='2rem 0 0 0'>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.CompanyName>Nombre de la empresa</styles.CompanyName>
                </styles.EntryVertical>
            </styles.Column>
            <styles.Column>
                <styles.InputText type='text' placeholder='Inactiva' width='13.5rem'></styles.InputText>
            </styles.Column>
        </styles.Container>

        <styles.Container margin='4rem 0 0 0'>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.Title>Razón Social*</styles.Title>
                    <styles.InputText type='text' placeholder='Ejm: Farogems Jewls OU'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Nombre de la persona de contacto*</styles.Title>
                    <styles.InputText type='text' placeholder='Ejm: Juan Pérez Solís'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>E-mail*</styles.Title>
                    <styles.EntryHorizontal>
                        <styles.InputText type='text' placeholder='Ejm: correo@correo.com' value={email} onChange={handleEmailChange}></styles.InputText>
                        <styles.ButtonAddDelete margin="0 0 0 0.5rem" color={color.green} onClick={handleAddEmail}>+</styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {newCompany.email.length > 0 && (
                        <styles.ArrayBox>
                            {newCompany.email.map((email, index) => (
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
                    <styles.Title>Teléfono*</styles.Title>
                    <styles.EntryHorizontal>
                        <styles.InputText type='text' placeholder='Ejm: 612345678' width='13.5rem' value={telefono} onChange={handleTelefonoChange}></styles.InputText>
                        <styles.ButtonAddDelete margin="0 0 0 0.5rem" color={color.green} onClick={handleAddTelefono}>+</styles.ButtonAddDelete>
                    </styles.EntryHorizontal>
                    {newCompany.telefono_contacto.length > 0 && (
                        <styles.ArrayBox>
                            {newCompany.telefono_contacto.map((telefono, index) => (
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
                    <styles.InputText type='date' width='13.5rem'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Modalidad contratada*</styles.Title>
                    <styles.Select width='11.5rem'>
                        <option>Trimestral</option>
                        <option>Semestral</option>
                        <option>Anual</option>
                        <option>My Business</option>
                    </styles.Select>
                </styles.EntryVertical>
            </styles.Column>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.Title>Nombre del titular*</styles.Title>
                    <styles.InputText type='text' placeholder='Ejm: Juan Pérez Solís'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Teléfono del titular*</styles.Title>
                    <styles.InputText type='text' placeholder='Ejm: 612345678' width='13.5rem'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Fecha de la siguiente renovación*</styles.Title>
                    <styles.InputText type='date' width='13.5rem'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Comentarios</styles.Title>
                    <styles.TextArea width='20rem'></styles.TextArea>
                </styles.EntryVertical>
                <styles.EntryHorizontal>
                    <styles.Button color={color.blue}>
                        <styles.IconModifyUser />
                        Modificar
                    </styles.Button>
                    <styles.Button color={color.red} margin='0 0 0 1.5rem'>
                        <styles.IconRemoveuser />
                        Dar de baja
                    </styles.Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <styles.CheckBox type='checkbox'></styles.CheckBox>
                    <styles.Title>No renovar al finalizar el contrato</styles.Title>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <styles.CheckBox type='checkbox'></styles.CheckBox>
                    <styles.Title>Procesar pago</styles.Title>
                </styles.EntryHorizontal>
            </styles.Column>
        </styles.Container>

    </>)
}
