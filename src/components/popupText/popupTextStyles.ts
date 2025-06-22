
import { styled } from 'styled-components'
import * as color from '../../common/styles/colors'


export const DialogPopup = styled.dialog`
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    z-index: 1;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: auto;
    padding: 2em;
    width: 50%;
    max-width: 50rem;
    height: auto;
    max-height: 30rem;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 5px 15px ${color.grayBorderText};
    background-color: ${color.white};

    &:hover {
        box-shadow: 0 5px 15px ${color.black};
    }
`

export const TextArea = styled.textarea`
    padding: 1em;
    width: 100%;
    heigth: auto;
    font-size: 1em;
    color: ${color.grayBorderText};
    border-radius: 0.5rem;
    border: 2px solid ${color.grayBorderText};
`