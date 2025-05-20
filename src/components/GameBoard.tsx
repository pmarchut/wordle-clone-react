import styles from "./GameBoard.module.scss"
import { useAppSelector } from '@/stores/store'
import { selectGuessIndex } from "@/stores/guessesSlice";
import AppRow from "@/components/AppRow"

function GameBoard() {
    const guesses = useAppSelector((state) => state.guesses);
    const guessIndex = useAppSelector(selectGuessIndex);

    return (
        <div className={`${styles.boardContainer}`}>
            <div className={`${styles.board}`}>
                <AppRow ariaLabel="Row 1" word={guesses.guesses[0]} wordCheckResults={guesses.checkResults[0]} invalid={(guessIndex === 0) && guesses.invalid} />
                <AppRow ariaLabel="Row 2" word={guesses.guesses[1]} wordCheckResults={guesses.checkResults[1]} invalid={(guessIndex === 1) && guesses.invalid} />
                <AppRow ariaLabel="Row 3" word={guesses.guesses[2]} wordCheckResults={guesses.checkResults[2]} invalid={(guessIndex === 2) && guesses.invalid} />
                <AppRow ariaLabel="Row 4" word={guesses.guesses[3]} wordCheckResults={guesses.checkResults[3]} invalid={(guessIndex === 3) && guesses.invalid} />
                <AppRow ariaLabel="Row 5" word={guesses.guesses[4]} wordCheckResults={guesses.checkResults[4]} invalid={(guessIndex === 4) && guesses.invalid} />
                <AppRow ariaLabel="Row 6" word={guesses.guesses[5]} wordCheckResults={guesses.checkResults[5]} invalid={(guessIndex === 5) && guesses.invalid} />
            </div>
        </div>
    )
}

export default GameBoard
