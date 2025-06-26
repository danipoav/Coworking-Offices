
import * as styles from './buttonStyles'


export const Button = (
    props: {
        children?: React.ReactNode
        margin?: string
        padding?: string
        width?: string
        color?: string
        radius?: string
        onClick?: React.MouseEventHandler<HTMLButtonElement>
    }
) => {

    return <styles.Button {...props}>{props.children}</styles.Button>

}