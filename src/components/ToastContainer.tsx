import styles from "./ToastContainer.module.scss"
import AppToast from "./AppToast"
import { useAppSelector } from '@/stores/store'

function ToastContainer() {
    const toasts = useAppSelector((state) => state.toasts);

    return (
        <div className={`${styles.toastContainer}`}>
            <div 
                className={`${styles.toaster} ${styles.gameToaster}`}
                id="gameToaster"
            >
                {toasts.toasts.map((toast) => (
                <AppToast 
                    key={toast.id} 
                    message={toast.message}
                    fade={toast.fade}
                />
                ))}
            </div>
        </div>
    )
}

export default ToastContainer
