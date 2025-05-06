import styles from './AppHelp.module.scss'
import AppTile from './AppTile'

function AppHelp() {
    return (
        <>
            <p className={`${styles.subheading}`}>Guess the Wordle in 6 tries.</p>
            <section 
                data-testid="app-help" 
                className={`${styles.help}`}
            >
                <ul className={`${styles.instructions}`}>
                    <li>Each guess must be a valid 5-letter word.</li>
                    <li>The color of the tiles will change to show how close your guess was to the word.</li>
                </ul>
                <div className={`${styles.examples}`}>
                    <h3 className={`${styles.bold}`}>Examples</h3>
                    <div 
                        aria-label="wordy" 
                        className={`${styles.example}`}
                        role="group" 
                        aria-roledescription="Example"
                    >
                        <div data-testid="wordy-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="1st letter, W, correct" dataState="correct" dataAnimation="flip-in">w</AppTile></div>
                        <div data-testid="wordy-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="2nd letter, O" dataState="tbd" dataAnimation="idle">o</AppTile></div>
                        <div data-testid="wordy-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="3rd letter, R" dataState="tbd" dataAnimation="idle">r</AppTile></div>
                        <div data-testid="wordy-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="4th letter, D" dataState="tbd" dataAnimation="idle">d</AppTile></div>
                        <div data-testid="wordy-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="5th letter, Y" dataState="tbd" dataAnimation="idle">y</AppTile></div>
                        <p><strong>W</strong> is in the word and in the correct spot.</p>
                    </div>
                    <div 
                        aria-label="light" 
                        className={`${styles.example}`}
                        role="group" 
                        aria-roledescription="Example"
                    >
                        <div data-testid="light-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="1st letter, L" dataState="tbd" dataAnimation="idle">l</AppTile></div>
                        <div data-testid="light-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="2nd letter, I, present in another position" dataState="present" dataAnimation="flip-in">i</AppTile></div>
                        <div data-testid="light-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="3rd letter, G" dataState="tbd" dataAnimation="idle">g</AppTile></div>
                        <div data-testid="light-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="4th letter, H" dataState="tbd" dataAnimation="idle">h</AppTile></div>
                        <div data-testid="light-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="5th letter, T" dataState="tbd" dataAnimation="idle">t</AppTile></div>
                        <p><strong>I</strong> is in the word but in the wrong spot.</p>
                    </div>
                    <div 
                        aria-label="rogue" 
                        className={`${styles.example}`}
                        role="group" 
                        aria-roledescription="Example"
                    >
                        <div data-testid="rogue-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="1st letter, R" dataState="tbd" dataAnimation="idle">r</AppTile></div>
                        <div data-testid="rogue-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="2nd letter, O" dataState="tbd" dataAnimation="idle">o</AppTile></div>
                        <div data-testid="rogue-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="3rd letter, G" dataState="tbd" dataAnimation="idle">g</AppTile></div>
                        <div data-testid="rogue-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="4th letter, U, absent" dataState="absent" dataAnimation="flip-in">u</AppTile></div>
                        <div data-testid="rogue-letter" className={`${styles.tileContainer}`}><AppTile small ariaLabel="5th letter, E" dataState="tbd" dataAnimation="idle">e</AppTile></div>
                        <p><strong>U</strong> is not in the word in any spot.</p>
                    </div>
                </div>
                <div className={`${styles.reminder}`}><p>A new puzzle is loaded every page refresh.</p></div>
            </section>    
        </>
    )
}

export default AppHelp
