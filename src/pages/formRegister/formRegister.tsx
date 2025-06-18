
import * as styles from './formRegisterStyles.ts'


export const FormRegister = () => {

    return (<>

        <styles.GlobalDateTimeStyles />

        <styles.Container>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.CompanyName>Nombre de la empresa</styles.CompanyName>
                </styles.EntryVertical>
            </styles.Column>
            <styles.Column>
                <styles.EntryVertical>
                    <styles.InputText type='text' placeholder='Inactiva'></styles.InputText>
                </styles.EntryVertical>
            </styles.Column>
        </styles.Container>

        <styles.Container>
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
                    <styles.InputText type='text' placeholder='Ejm: correo@correo.com'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Teléfono*</styles.Title>
                    <styles.InputText type='text' placeholder='Ejm: 612345678'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Fecha de contratación*</styles.Title>
                    <styles.InputText type='date'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Modalidad contratada*</styles.Title>
                    <styles.Select>
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
                    <styles.InputText type='text' placeholder='Ejm: 612345678'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Fecha de última renovación*</styles.Title>
                    <styles.InputText type='date'></styles.InputText>
                </styles.EntryVertical>
                <styles.EntryVertical>
                    <styles.Title>Comentarios</styles.Title>
                    <styles.TextArea></styles.TextArea>
                </styles.EntryVertical>
                <styles.EntryHorizontal>
                    <styles.ButtonBlue>
                        <styles.IconModifyUser />
                        Modificar
                    </styles.ButtonBlue>
                    <styles.ButtonGreen>
                        <styles.IconAdduser />
                        Dar de alta
                    </styles.ButtonGreen>
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
