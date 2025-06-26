
import { styled } from 'styled-components'
import * as color from '../../common/styles/colors'


export const Button = styled.button<{ margin?: string; padding?: string; width?: string; color?: string, radius?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    width: ${props => props.width || 'auto'};
    margin: ${props => props.margin || '0rem'};
    padding: ${props => props.padding || '0.5em 1em'};
    border-radius: ${props => props.radius || '0.5rem'};
    font-weight: 500;
    cursor: pointer;
    color: ${color.white};
    background-color: ${props => props.color || 'blue'};
    transition: transform 0.2s ease, background 0.2s ease;

    &:hover {
        transform: scale(1.075);
    }
`