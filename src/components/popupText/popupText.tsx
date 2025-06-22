
import * as styles from './popupTextStyles.ts'
import * as color from '../../common/styles/colors.ts'
import { EntryHorizontal } from '../../common/styles/formStyles.ts'
import { Button } from '../button/button.tsx'


export const PopupText = () => {

    return (

        <styles.DialogPopup>
            <styles.TextArea placeholder='Indicar motivo de no renovación'></styles.TextArea>
            <EntryHorizontal justifycontent='right'>
                <Button color={color.red}>Cancelar</Button>
                <Button color={color.green}>Guardar</Button>
            </EntryHorizontal>
        </styles.DialogPopup>

    )
}