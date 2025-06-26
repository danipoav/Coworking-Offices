
import { styled } from 'styled-components'
import { createGlobalStyle } from 'styled-components'

import { LuUserRoundPen } from "react-icons/lu"
import { LuUserRoundPlus } from "react-icons/lu"
import { LuUserRoundX } from "react-icons/lu"
import { AiOutlineEuro } from "react-icons/ai"
import { FiDownload } from "react-icons/fi"

import * as color from '../../common/styles/colors'


export const BackButtonStyled = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 6rem;
    height: 3rem;
    background: linear-gradient(to right, #2563eb, #1e40af); /* de blue-600 a blue-800 */
    color: ${color.white};
    font-weight: 600;
    border: none;
    border-radius: 9999px; /* full rounded */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;

    &:hover {
        transform: scale(1.1);
        background: linear-gradient(to right, #3b82f6, #1d4ed8); /* hover:from-blue-500 hover:to-blue-700 */
    }

    svg {
        color: white;
    }
`

export const GlobalDateTimeStyles = createGlobalStyle`
    input[type="month"]::-webkit-calendar-picker-indicator {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: auto;
        height: auto;
        background: transparent;
        cursor: pointer;
    }

    input[type="month"] {
        position: relative;
    }
`

export const Container = styled.div<{ justifycontent?: string }>`
    display: flex;
    justify-content: ${props => props.justifycontent || 'left'};
    gap: 7.5rem;
`

export const Column = styled.div<{ padding?: string }>`
    display: flex;
    flex-direction: column;
    padding: ${props => props.padding || '1em'};
    gap: 2rem;
`

export const EntryVertical = styled.div<{ gap?: string }>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.gap || '0.5rem'};
`

export const EntryHorizontal = styled.div<{ justifycontent?: string }>`
    display: flex;
    align-items: center;
    justify-content: ${props => props.justifycontent || 'left'};
    gap: 0.5rem;
`

export const CompanyName = styled.h2`
    font-size: 1.75em;
    font-weight: 700;
`

export const Title = styled.h4`
    font-size: 1em;
    font-weight: 600;
`

export const InputText = styled.input<{ width?: string; editable?: boolean }>`
    padding: 0.75em;
    text-align: left;
    height: 2.75rem;
    width: ${props => props.width || '25rem'};
    font-weight: 600;
    border: 2px solid ${props => (props.editable ? color.black : color.grayBorderText)};
    border-radius: 0.4rem;
    color: ${props => (props.editable ? color.black : color.grayBorderText)};
    background-color: ${color.grayBackgroundInput};
    cursor: pointer;

    &::placeholder {
        color: ${props => (props.editable ? color.grayBorderText : color.grayBackgroundInput)};
    }
`

export const Select = styled.select<{ width?: string; editable?: boolean }>`
    position: relative;
    padding: 0.5em 2.5rem 0.5em 0.5em;
    text-align: left;
    height: 2.75rem;
    width: ${props => props.width || '25rem'};
    font-weight: 600;
    border: 2px solid ${props => (props.editable ? color.black : color.grayBorderText)};
    border-radius: 0.4rem;
    color: ${props => (props.editable ? color.black : color.grayBorderText)};
    outline: none;
    cursor: pointer;
    background-color: ${color.grayBackgroundInput};

    /* Ocultar la flecha nativa */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    /* Añadir dos flechas con background-image y background-position */
    background-image:
    url("data:image/svg+xml;utf8,<svg fill='%23666' height='24' viewBox='0 0 24 24' width='12' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>"),  /* flecha abajo */
    url("data:image/svg+xml;utf8,<svg fill='%23666' height='24' viewBox='0 0 24 24' width='12' xmlns='http://www.w3.org/2000/svg'><path d='M7 14l5-5 5 5z'/></svg>");  /* flecha arriba */

    background-repeat: no-repeat, no-repeat;
    background-position:
    right 0.75rem bottom 0rem,      /* flecha abajo */
    right 0.75rem top 0.10rem;      /* flecha arriba */
    background-size: 1rem, 1rem;
`

export const TextArea = styled.textarea<{ width?: string; editable?: boolean }>`
    padding: 0.5em;
    text-align: left;
    width: ${props => props.width || '25rem'};
    height: 7.5rem;
    font-weight: 600;
    border: none;
    border: 2px solid ${props => (props.editable ? color.black : color.grayBorderText)};
    border-radius: 0.4rem;
    color: ${props => (props.editable ? color.black : color.grayBorderText)};
    outline: none;
    background-color: ${color.grayBackgroundInput};
`

export const ButtonAddDelete = styled.button<{ margin?: string; color?: string; editable?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${props => props.margin || '0rem'};
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    font-size: 1.25em;
    font-weight: 700;
    cursor: pointer;
    color: ${color.white};
    background-color: ${props => props.editable ? (props.color || color.black) : color.grayBorderText};
`

export const IconModifyUser = styled(LuUserRoundPen)`
    vertical-align: middle;
    padding: 0.2em;
    width: 2.25rem;
    height: auto;
    border-radius: 0.5rem;
    color: ${color.white};
`

export const IconAdduser = styled(LuUserRoundPlus)`
    vertical-align: middle;
    padding: 0.2em;
    width: 2.25rem;
    height: auto;
    border-radius: 0.5rem;
    color: ${color.white};
`

export const IconRemoveuser = styled(LuUserRoundX)`
    vertical-align: middle;
    padding: 0.2em;
    width: 2.25rem;
    height: auto;
    border-radius: 0.5rem;
    color: ${color.white};
`

export const IconProcessPay = styled(AiOutlineEuro)`
    vertical-align: middle;
    padding: 0.2em;
    width: 2.25rem;
    height: auto;
    border-radius: 0.5rem;
    color: ${color.white};
`

export const IconHistorical = styled(FiDownload)`
    vertical-align: middle;
    padding: 0.2em;
    width: 2.25rem;
    height: auto;
    border-radius: 0.5rem;
    color: ${color.white};
`

export const CheckBox = styled.input`
    transform: scale(1.5);
    accent-color: ${color.blue};
    cursor: pointer;
`

export const ArrayBox = styled.div<{ editable?: boolean }>`
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.5rem;
    gap: 0.5rem;
    width: fit-content;
    font-weight: 600;
    max-width: 35rem;
    border: 2px solid ${props => (props.editable ? color.black : color.grayBorderText)};
    border-radius: 0.4rem;
    color: ${props => (props.editable ? color.black : color.grayBorderText)};
    background-color: ${color.grayBackgroundInput};
`

export const ArrayItem = styled.span`
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
`;
