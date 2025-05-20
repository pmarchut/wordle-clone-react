import styles from "./AppToast.module.scss"

function AppToast({ message, fade }: {
    message: string,
    fade?: boolean,
}) {
    return (
        <div className={`${styles.toast} ${fade ? styles.fade : ''}`} aria-live="polite">{ message }</div>
    )
}

export default AppToast
