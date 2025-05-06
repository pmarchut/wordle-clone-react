import styles from './AppSettings.module.scss'
import AppSwitch from './AppSwitch'
import { useEffect, useState } from 'react'

function AppSettings() {
    const [hardMode, setHardMode] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [colorblind, setColorblind] = useState(false);
    const [onscreenInputOnly, setOnscreenInputOnly] = useState(false);

    useEffect(() => {
        const savedHardMode = localStorage.getItem("wordle-hardmode") === "true";
        const savedDarkMode = localStorage.getItem("wordle-darkmode") === "true";
        const savedColorblind = localStorage.getItem("wordle-colorblind") === "true";
        const savedOnscreenInputOnly = localStorage.getItem("wordle-onscreen-input-only") === "true";
        setHardMode(savedHardMode);
        setDarkMode(savedDarkMode);
        setColorblind(savedColorblind);
        setOnscreenInputOnly(savedOnscreenInputOnly);
    }, []);

    const toggleHardMode = (newValue: boolean) => {
        setHardMode(newValue);
        localStorage.setItem("wordle-hardmode", String(newValue));
    };
    const toggleDarkMode = (newValue: boolean) => {
        setDarkMode(newValue);
        localStorage.setItem("wordle-darkmode", String(newValue));
        document.body.classList.toggle("dark", newValue);
    };
    const toggleColorblind = (newValue: boolean) => {
        setColorblind(newValue);
        localStorage.setItem("wordle-colorblind", String(newValue));
        document.body.classList.toggle("colorblind", newValue);
    };
    const toggleOnscreenInputOnly = (newValue: boolean) => {
        setOnscreenInputOnly(newValue);
        localStorage.setItem("wordle-onscreen-input-only", String(newValue));
    };

    return (
        <div className={`${styles.container}`}>
            <section>
            <div className={`${styles.setting}`}>
                <div className={`${styles.text}`}>
                    <h3 className={`${styles.title}`}>Hard Mode</h3>
                    <p className={`${styles.description}`}>Any revealed hints must be used in subsequent guesses</p>
                </div>
                <AppSwitch 
                    label="Hard Mode" 
                    value={hardMode}
                    onToggle={toggleHardMode}
                />
            </div>
            <div className={`${styles.setting}`}>
                <div className={`${styles.text}`}>
                    <h3 className={`${styles.title}`}>Dark Theme</h3>
                </div>
                <AppSwitch 
                    label="Dark Mode"
                    value={darkMode}
                    onToggle={toggleDarkMode}
                />
            </div>
            <div className={`${styles.setting}`}>
                <div className={`${styles.text}`}>
                    <h3 className={`${styles.title}`}>High Contrast Mode</h3>
                    <p className={`${styles.description}`}>Contrast and colorblindness improvements</p>
                </div>
                <AppSwitch 
                    label="High Contrast Mode" 
                    value={colorblind}
                    onToggle={toggleColorblind} 
                />
            </div>
            <div className={`${styles.setting}`}>
                <div className={`${styles.text}`}>
                    <h3 className={`${styles.title}`}>Onscreen Keyboard Input Only</h3>
                    <p className={`${styles.description}`}>Ignore key input except from the onscreen keyboard. Most helpful for users using speech recognition or other assistive devices.</p>
                </div>
                <AppSwitch 
                    label="Virtual Keyboard Input Only"
                    value={onscreenInputOnly}
                    onToggle={toggleOnscreenInputOnly}
                />
            </div>
            </section>
        </div>
    )
}

export default AppSettings
