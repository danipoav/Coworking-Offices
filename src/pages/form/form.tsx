
import formStyles from "./formStyles.module.scss"


export const Form = () => {

    return (<>

        <div className={formStyles.container}>
            <div className={formStyles.column}>
                <div className={formStyles.entryVertical}>
                    <h2 className={formStyles.companyName}>Nombre de la empresa</h2>
                </div>
            </div>
            <div className={formStyles.column}>
                <div className={formStyles.entryVertical}>
                    <input className={formStyles.inputText} type="text" placeholder="Inactiva"></input>
                </div>
            </div>
        </div>

        <div className={formStyles.container}>
            <div className={formStyles.column}>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Razón Social*</h4>
                    <input className={formStyles.inputText} type="text" placeholder="Ejm: Farogems Jewls OU"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Nombre de la persona de contacto*</h4>
                    <input className={formStyles.inputText} type="text" placeholder="Ejm: Juan Pérez Solís"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>E-mail*</h4>
                    <input className={formStyles.inputText} type="text" placeholder="Ejm: correo@correo.com"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Teléfono*</h4>
                    <input className={formStyles.inputText} type="text" placeholder="Ejm: 612345678"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Fecha de contratación*</h4>
                    <input className={formStyles.inputText} type="date"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>ssssss*</h4>
                    <select className={formStyles.inputText}>
                        <option>Trimestral</option>
                        <option>Semestral</option>
                        <option>Anual</option>
                        <option>My Business</option>
                    </select>
                </div>
            </div>

            <div className={formStyles.column}>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Nombre del titular*</h4>
                    <input className={formStyles.inputText} type="text" placeholder="Ejm: Juan Pérez Solís"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Teléfono del titular*</h4>
                    <input className={formStyles.inputText} type="text" placeholder="Ejm: 612345678"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Fecha de última renovación*</h4>
                    <input className={formStyles.inputText} type="date"></input>
                </div>
                <div className={formStyles.entryVertical}>
                    <h4 className={formStyles.title}>Comentarios</h4>
                    <textarea className={formStyles.textArea}></textarea>
                </div>
                <div className={formStyles.entryHorizontal}>
                    <button className={`${formStyles.button} ${formStyles["button--blue"]}`}>Modificar</button>
                    <button className={`${formStyles.button} ${formStyles["button--green"]}`}>Dar de alta</button>
                </div>
                <div className={formStyles.entryHorizontal}>
                    <input className={formStyles.checkbox} type="checkbox"></input>
                    <h4 className={formStyles.title}>No renovar al finalizar el contrato</h4>
                </div>
                <div className={formStyles.entryHorizontal}>
                    <label className={formStyles.toggleSwitch}>
                        <input type="checkbox" />
                        <span className={formStyles.slider}></span>
                    </label>
                    <h4 className={formStyles.title}>Procesar pago</h4>
                </div>
            </div>
        </div>

    </>)
}
