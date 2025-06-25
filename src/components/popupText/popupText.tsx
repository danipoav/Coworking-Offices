
import { useState } from 'react'

import * as styles from './popupTextStyles'
import * as color from '../../common/styles/colors'
import { EntryHorizontal } from '../../common/styles/formStyles'
import { Button } from '../button/button'


type PopupTextProps = {
    onCancel?: () => void
    onSave?: (text: string) => void
}

export const PopupText = ({ onCancel, onSave }: PopupTextProps) => {

    const [text, setText] = useState('')

    const handleSave = () => {
        if (onSave) onSave(text)
    }

    return (

        <styles.DialogPopup>
            <styles.TextArea
                placeholder='Indicar motivo de no renovación'
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <EntryHorizontal justifycontent='right'>
                <Button color={color.red} onClick={onCancel}>Cancelar</Button>
                <Button color={color.green} onClick={handleSave}>Guardar</Button>
            </EntryHorizontal>
        </styles.DialogPopup>

    )
}