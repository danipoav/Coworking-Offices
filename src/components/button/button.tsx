
import * as styles from './buttonStyles.ts'


export const Button = (
    props: {
        children?: React.ReactNode
        margin?: string
        padding?: string
        color?: string
        radius?: string
    }
) => {

    return <styles.Button {...props}>{props.children}</styles.Button>

}