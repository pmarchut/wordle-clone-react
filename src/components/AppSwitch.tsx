import styles from './AppSwitch.module.scss'

function AppSwitch({ label, value, onToggle }: {
  label: string;
  value?: boolean;
  onToggle: (newValue: boolean) => void;
}) {
    return (
        <div 
            id={label}
            className={`${value ? styles.checked : ''}`}
        >
            <button 
                aria-disabled="false" 
                aria-checked={value} 
                aria-label={label} 
                role="switch" 
                type="button" 
                className={`${styles.switch}`}
                onClick={() => onToggle(!value)}
            >
                <span className={`${styles.knob}`}></span>
            </button>
        </div>
    )
}

export default AppSwitch
