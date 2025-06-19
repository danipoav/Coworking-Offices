
import { useState, useEffect } from "react"
import type { Empresa } from '../../interfaces/Empresa.ts'

import * as styles from './formRegisterStyles.ts'
import * as color from '../../common/styles/colors.ts'


export const FormRegister = () => {

    const [newCompany, setNewCompany] = useState<Empresa>({
        id: '',
        razon_social: '',
        email: [''],
        fecha_inicio: '',
        fecha_renovacion: '',
        modalidad: '',
        myBusiness: false,
        pendiente_pago: false,
        renovacion: false,
        contacto: '',
        telefono_contacto: [''],
        titular: '',
        telefono_titular: '',
        comentarios: '',
        logo: ''
    })

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewCompany({
            ...newCompany,
            [name]: value
        })
    }

    

    return (<>

        {console.log(newCompany)}

        <styles.GlobalDateTimeStyles />

        <styles.Container>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.CompanyName>Nombre de la empresa</styles.CompanyName>
                </styles.EntryVertical>
            </styles.Column>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.InputText type='text' placeholder='Inactiva' width='13.5rem'></styles.InputText>
                </styles.EntryVertical>
            </styles.Column>
        </styles.Container>

        <styles.Container margin='5rem 0 0 0'>
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
                        <styles.InputText type='text' placeholder='Ejm: correo@correo.com'></styles.InputText>
                        <styles.Button margin="0 0 0 0.5rem" color={color.green} radius="50%">+</styles.Button>
                    </styles.EntryHorizontal>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Teléfono*</styles.Title>
                    <styles.EntryHorizontal>
                        <styles.InputText type='text' placeholder='Ejm: 612345678' width='13.5rem' name="telefono" onChange={handleStringChange}></styles.InputText>
                        <styles.Button margin="0 0 0 0.5rem" color={color.green} radius="50%">+</styles.Button>
                    </styles.EntryHorizontal>
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
                    <styles.Title>Fecha de última renovación*</styles.Title>
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
                        <styles.IconAdduser />
                        Dar de alta
                    </styles.Button>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <styles.CheckBox type='checkbox'></styles.CheckBox>
                    <styles.Title>No renovar al finalizar el contrato</styles.Title>
                </styles.EntryHorizontal>
                <styles.EntryHorizontal>
                    <styles.ToggleSwitch>
                        <input type="checkbox" />
                        <span></span>
                    </styles.ToggleSwitch>
                    <styles.Title>Procesar pago</styles.Title>
                </styles.EntryHorizontal>
            </styles.Column>
        </styles.Container>

    </>)
}
