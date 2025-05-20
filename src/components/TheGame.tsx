import styles from "./TheGame.module.scss"
import GameBoard from "@/components/GameBoard"
import GameKeyboard from "@/components/GameKeyboard"

function TheGame() {
    return (
        <main 
            className={`${styles.game} ${styles.withToolbar}`}
            id="wordle-app-game"
            style={{ maxHeight: 'calc(100% - 210px - var(--header-height))' }}
        >
            <GameBoard />
            <GameKeyboard />
        </main>
    )
}

export default TheGame
