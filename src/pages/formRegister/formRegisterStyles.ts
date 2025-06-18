
import { styled } from 'styled-components'
import { createGlobalStyle } from 'styled-components'

import { LuUserRoundPen } from "react-icons/lu";
import { LuUserRoundPlus } from "react-icons/lu";

import * as color from '../../common/styles/colors.ts'


export const GlobalDateTimeStyles = createGlobalStyle`
    input[type="date"]::-webkit-calendar-picker-indicator {
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

    input[type="date"] {
        position: relative;
    }
`

export const Container = styled.div`
    display: flex;
    margin-bottom: 5rem;
`

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2rem;
`

export const EntryVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

export const EntryHorizontal = styled.div`
    display: flex;
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

export const InputText = styled.input`
    padding: 0.5em;
    text-align: left;
    height: 2.75rem;
    width: 65%;
    font-weight: 600;
    border: 2px solid ${color.grayBorderText};
    border-radius: 0.4rem;
    color: ${color.grayBorderText};
    outline: none;
    background-color: ${color.grayBackgroundInput};
`

export const Select = styled.select`
    padding: 0.5em;
    text-align: left;
    height: 2.75rem;
    width: 65%;
    font-weight: 600;
    border: 2px solid ${color.grayBorderText};
    border-radius: 0.4rem;
    color: ${color.grayBorderText};
    outline: none;
    background-color: ${color.grayBackgroundInput};
`

export const TextArea = styled.textarea`
    padding: 0.5em;
    text-align: left;
    width: 100%;
    height: 7.5rem;
    font-weight: 400;
    border: none;
    border: 2px solid ${color.grayBorderText};
    border-radius: 0.4rem;
    color: ${color.grayBorderText};
    outline: none;
    background-color: ${color.grayBackgroundInput};
`

export const ButtonBlue = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 1em;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    color: ${color.white};
    background-color: ${color.blue};
`

export const ButtonGreen = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 1em;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    color: ${color.white};
    background-color: ${color.green};
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

export const CheckBox = styled.input`
    transform: scale(1.5);
    accent-color: ${color.blue};
    cursor: pointer;
`

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 3.5rem;
  height: 2rem;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${color.green}; // apagado
    transition: 0.4s;
    border-radius: 2rem;

    &::before {
      position: absolute;
      content: "";
      height: 1.4rem;
      width: 1.4rem;
      left: 0.3rem;
      bottom: 0.3rem;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: ${color.green}; // encendido
  }

  input:checked + span::before {
    transform: translateX(1.5rem);
  }
`