import styles from './TheDialog.module.scss'
import { DialogProps } from '../stores/dialogSlice'
import AppHelp from './AppHelp'
import AppSettings from './AppSettings'

function TheDialog(props: {
  dialog: DialogProps,
  closeDialog: () => void,
}) {
  const closeDialog = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialogElement = event.target as HTMLDialogElement;
  
    // Sprawdzamy, czy kliknięto dokładnie w <dialog>, a nie w jego zawartość
    if (dialogElement.tagName === "DIALOG") {
      props.closeDialog();
    }
  };

  return (
    <dialog 
      open 
      className={`${styles.modalOverlay} ${styles.paddingTop}`} 
      data-testid="modal-overlay"
      aria-label={props.dialog.type}
      aria-modal="true" 
      id={props.dialog.id}
      onClick={closeDialog}
    >
      <div 
        className={`${styles.content} ${styles.testExtraWidth} ${props.dialog.type === 'help Dialog' ? styles.extraPadding : ''}`}
        data-testid="modal-content"
      >
            <div 
              className={`${styles.topWrapper} ${props.dialog.type === 'help Dialog' ? styles.newHeading : ''}`}
              data-testid="modal-heading"
            >
              <h2 className={`${styles.heading}`}>{ props.dialog.heading }</h2>
                <button 
                  className={`${styles.closeIcon}`} 
                  type="button" 
                  aria-label="Close"
                  onClick={props.closeDialog}
                >
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" className="game-icon" data-testid="icon-close"><path fill="var(--color-tone-1)" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                </button>
                {(props.dialog.type === 'help Dialog') && <AppHelp />}
                {(props.dialog.type === 'settings Dialog') && <AppSettings />}
            </div>
        </div>
    </dialog>
  )
}

export default TheDialog
