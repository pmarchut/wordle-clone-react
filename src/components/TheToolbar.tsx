import styles from "./TheToolbar.module.scss"
import HelpButton from "./HelpButton"
import SettingsButton from "./SettingsButton"

function TheToolbar() {
  return (
    <header>
      <section 
        data-testid="toolbar"
        className={`toolbar ${styles.wordle}`}
      >
        <HelpButton />
        <SettingsButton />
      </section>
    </header>
  )
}

export default TheToolbar
